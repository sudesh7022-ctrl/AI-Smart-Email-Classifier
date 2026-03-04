package com.classifier.controller;

import com.classifier.entity.User;
import com.classifier.repository.EmailLogRepository;
import com.classifier.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailLogRepository emailLogRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication()
                    .getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);

            if (user == null) {
                return ResponseEntity.status(401).body("User not found.");
            }

            long totalEmails = emailLogRepository.countByUserId(user.getId());

            Map<String, Object> profileData = new HashMap<>();
            profileData.put("username", user.getUsername());
            profileData.put("email", user.getEmail());
            profileData.put("role", user.getRole());
            profileData.put("provider", user.getProvider());
            profileData.put("totalClassifications", totalEmails);

            return ResponseEntity.ok(profileData);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving profile: " + e.getMessage());
        }
    }
}
