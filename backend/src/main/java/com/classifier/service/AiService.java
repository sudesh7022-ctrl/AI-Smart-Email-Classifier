package com.classifier.service;

import com.classifier.payload.ClassificationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AiService {

    @Autowired
    private LocalAiService localAiService;

    public ClassificationResponse classifyEmail(String text) {
        try {
            return localAiService.classifyEmail(text);
        } catch (Exception e) {
            // Fallback gracefully for the context of this project if AI service is down
            return new ClassificationResponse(null, "Error: AI Service Unavailable", 0.0);
        }
    }
}
