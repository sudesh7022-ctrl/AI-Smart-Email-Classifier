package com.classifier.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "emails")
public class EmailLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String emailText;

    @Column(nullable = false)
    private String prediction;

    @Column(nullable = false)
    private Double confidence;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public EmailLog() {}

    public EmailLog(User user, String emailText, String prediction, Double confidence) {
        this.user = user;
        this.emailText = emailText;
        this.prediction = prediction;
        this.confidence = confidence;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getEmailText() { return emailText; }
    public void setEmailText(String emailText) { this.emailText = emailText; }

    public String getPrediction() { return prediction; }
    public void setPrediction(String prediction) { this.prediction = prediction; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
