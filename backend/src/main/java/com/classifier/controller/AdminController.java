package com.classifier.controller;

import com.classifier.entity.EmailLog;
import com.classifier.entity.User;
import com.classifier.repository.EmailLogRepository;
import com.classifier.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailLogRepository emailLogRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/emails")
    public ResponseEntity<List<EmailLog>> getAllEmails() {
        // Find all emails and sort by ID descending (newest first)
        List<EmailLog> emails = emailLogRepository.findAll();
        // Since findAll doesn't guarantee order, you could write a custom query in repository,
        // but for simplicity here we just return the full list.
        return ResponseEntity.ok(emails);
    }
}
