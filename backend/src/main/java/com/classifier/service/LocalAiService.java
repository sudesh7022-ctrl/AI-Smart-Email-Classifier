package com.classifier.service;

import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.FileCopyUtils;

import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.*;

import com.classifier.payload.ClassificationResponse;

@Service
public class LocalAiService {

    // 0 = Inbox, 1 = Spam
    private final String[] classes = { "Inbox", "Spam" };

    // Model parameters
    private double[] logPriors = new double[2];
    private Map<String, double[]> logLikelihoods = new HashMap<>(); // word -> [logP(word|Inbox), logP(word|Spam)]
    private boolean modelTrained = false;

    @PostConstruct
    public void init() {
        try {
            ClassPathResource resource = new ClassPathResource("dataset.csv");
            Reader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8);
            String content = FileCopyUtils.copyToString(reader);

            String[] lines = content.split("\n");

            List<String[]> docs = new ArrayList<>();
            List<Integer> labels = new ArrayList<>();

            // Skip header
            for (int i = 1; i < lines.length; i++) {
                String line = lines[i].trim();
                if (line.isEmpty())
                    continue;

                int lastComma = line.lastIndexOf(",");
                if (lastComma == -1)
                    continue;

                String text = line.substring(0, lastComma);
                if (text.startsWith("\"") && text.endsWith("\"")) {
                    text = text.substring(1, text.length() - 1);
                }
                String labelStr = line.substring(lastComma + 1).trim();

                docs.add(tokenize(text));
                labels.add(labelStr.equalsIgnoreCase("Spam") ? 1 : 0);
            }

            trainNaiveBayes(docs, labels);

            System.out.println("Custom Local AI Model trained successfully with " + docs.size() + " records.");

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to train local AI model!");
        }
    }

    private String[] tokenize(String text) {
        text = text.toLowerCase().replaceAll("[^a-z0-9\\s]", "");
        return text.split("\\s+");
    }

    private void trainNaiveBayes(List<String[]> docs, List<Integer> labels) {
        int numDocs = docs.size();
        int[] classCounts = new int[2];

        Map<String, int[]> wordCountsByClass = new HashMap<>();
        int[] totalWordsByClass = new int[2];

        // Count frequencies
        for (int i = 0; i < numDocs; i++) {
            int c = labels.get(i);
            classCounts[c]++;

            for (String w : docs.get(i)) {
                if (w.isEmpty())
                    continue;
                wordCountsByClass.putIfAbsent(w, new int[2]);
                wordCountsByClass.get(w)[c]++;
                totalWordsByClass[c]++;
            }
        }

        // Calculate Log Priors
        logPriors[0] = Math.log((double) classCounts[0] / numDocs);
        logPriors[1] = Math.log((double) classCounts[1] / numDocs);

        // Calculate Log Likelihoods with Laplace Smoothing (alpha = 1)
        int vocabSize = wordCountsByClass.size();
        for (String w : wordCountsByClass.keySet()) {
            int[] counts = wordCountsByClass.get(w);
            double[] logprobs = new double[2];
            logprobs[0] = Math.log((counts[0] + 1.0) / (totalWordsByClass[0] + vocabSize));
            logprobs[1] = Math.log((counts[1] + 1.0) / (totalWordsByClass[1] + vocabSize));
            logLikelihoods.put(w, logprobs);
        }

        // Also need the default log prob for unseen words
        logLikelihoods.put("__unseen__", new double[] {
                Math.log(1.0 / (totalWordsByClass[0] + vocabSize)),
                Math.log(1.0 / (totalWordsByClass[1] + vocabSize))
        });

        modelTrained = true;
    }

    public ClassificationResponse classifyEmail(String text) {
        if (!modelTrained) {
            return new ClassificationResponse(null, "Error: AI Model Not Loaded", 0.0);
        }

        try {
            String[] words = tokenize(text);

            double[] scores = new double[] { logPriors[0], logPriors[1] };

            for (String w : words) {
                if (w.isEmpty())
                    continue;
                double[] logprobs = logLikelihoods.getOrDefault(w, logLikelihoods.get("__unseen__"));
                scores[0] += logprobs[0];
                scores[1] += logprobs[1];
            }

            // Convert log scores to probabilities using softmax
            double maxScore = Math.max(scores[0], scores[1]);
            double sumExp = Math.exp(scores[0] - maxScore) + Math.exp(scores[1] - maxScore);
            double prob0 = Math.exp(scores[0] - maxScore) / sumExp;
            double prob1 = Math.exp(scores[1] - maxScore) / sumExp;

            int predictedClass = prob1 > prob0 ? 1 : 0;
            Double confidence = predictedClass == 1 ? prob1 : prob0;

            return new ClassificationResponse(null, classes[predictedClass], confidence);
        } catch (Exception e) {
            return new ClassificationResponse(null, "Error: Classification Failed", 0.0);
        }
    }
}
