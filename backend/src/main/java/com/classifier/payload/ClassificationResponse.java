package com.classifier.payload;

public class ClassificationResponse {
    private String category;
    private Double confidence;

    public ClassificationResponse() {}

    public ClassificationResponse(String category, Double confidence) {
        this.category = category;
        this.confidence = confidence;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
}
