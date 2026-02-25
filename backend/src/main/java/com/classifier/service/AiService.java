package com.classifier.service;

import com.classifier.payload.ClassificationRequest;
import com.classifier.payload.ClassificationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AiService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    public ClassificationResponse classifyEmail(String text) {
        ClassificationRequest request = new ClassificationRequest();
        request.setText(text);
        
        try {
            return restTemplate.postForObject(aiServiceUrl, request, ClassificationResponse.class);
        } catch (Exception e) {
            // Fallback gracefully for the context of this project if AI service is down
            return new ClassificationResponse("Error: AI Service Unavailable", 0.0);
        }
    }
}
