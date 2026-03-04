package com.classifier.payload;

public class ClassificationResponse {
    private Long id;
    private String category;
    private Double confidence;

    public ClassificationResponse() {
    }

    public ClassificationResponse(Long id, String category, Double confidence) {
        this.id = id;
        this.category = category;
        this.confidence = confidence;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }
}
