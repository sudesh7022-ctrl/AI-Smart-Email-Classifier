package com.classifier.controller;

import com.classifier.entity.User;
import com.classifier.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    @Value("${spring.mail.username}")
    private String adminEmail;

    public record SupportRequest(String message) {
    }

    @PostMapping("/support")
    public ResponseEntity<?> receiveSupportQuery(@RequestBody SupportRequest request) {
        if (request.message() == null || request.message().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Message cannot be empty.");
        }

        try {
            // Get currently authenticated user details
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication()
                    .getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);

            if (user == null) {
                return ResponseEntity.status(401).body("User not found.");
            }

            // Construct the email to send to the Admin
            SimpleMailMessage email = new SimpleMailMessage();
            email.setTo(adminEmail);
            email.setSubject("New Support Query from " + user.getUsername());
            email.setText(
                    "You have received a new message from your website's Chat Widget!\n\n" +
                            "Username: " + user.getUsername() + "\n" +
                            "Email: " + user.getEmail() + "\n\n" +
                            "Message:\n" + request.message());

            // Send the email
            mailSender.send(email);

            return ResponseEntity.ok("Message sent successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to send message: " + e.getMessage());
        }
    }
}
