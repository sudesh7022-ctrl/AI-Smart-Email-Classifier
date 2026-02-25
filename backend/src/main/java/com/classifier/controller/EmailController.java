package com.classifier.controller;

import com.classifier.entity.EmailLog;
import com.classifier.entity.User;
import com.classifier.payload.ClassificationRequest;
import com.classifier.payload.ClassificationResponse;
import com.classifier.repository.EmailLogRepository;
import com.classifier.repository.UserRepository;
import com.classifier.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emails")
public class EmailController {

    @Autowired
    private AiService aiService;

    @Autowired
    private EmailLogRepository emailLogRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/classify")
    public ResponseEntity<?> classifyEmail(@RequestBody ClassificationRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).get();

        // Call FastAPI internally to predict
        ClassificationResponse response = aiService.classifyEmail(request.getText());

        if (response.getCategory().startsWith("Error")) {
            return ResponseEntity.status(503).body("AI Service is currently unavailable. Please try again later.");
        }

        // Save prediction result to DB
        EmailLog emailLog = new EmailLog(user, request.getText(), response.getCategory(), response.getConfidence());
        emailLogRepository.save(emailLog);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<?> getEmailHistory() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).get();

        List<EmailLog> logs = emailLogRepository.findByUserIdOrderByTimestampDesc(user.getId());
        return ResponseEntity.ok(logs);
    }
}
