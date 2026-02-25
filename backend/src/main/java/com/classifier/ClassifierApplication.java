package com.classifier;

import com.classifier.entity.User;
import com.classifier.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ClassifierApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClassifierApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User(
                        "admin",
                        "admin@classifier.com",
                        passwordEncoder.encode("admin123"),
                        "ROLE_ADMIN");
                userRepository.save(admin);
                System.out.println("Default admin user created: admin / admin123");
            }
        };
    }
}
