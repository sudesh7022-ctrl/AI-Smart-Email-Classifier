package com.classifier.security;

import com.classifier.entity.User;
import com.classifier.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = token.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
        } else {
            user = new User();
            user.setEmail(email);
            // using email as username or the name from google
            user.setUsername(email);
            // users registered via oauth don't need a local password
            user.setPassword("");
            user.setRole("ROLE_USER");
            user.setProvider("GOOGLE");
            user.setProviderId(oAuth2User.getAttribute("sub"));
            userRepository.save(user);
        }

        String jwtToken = jwtUtil.generateToken(user);
        String role = user.getRole();

        // Redirect to the React frontend with the token
        String frontendUrl = "http://localhost:5173/oauth2/redirect?token=" + jwtToken + "&username=" + user.getUsername() + "&role=" + role;
        getRedirectStrategy().sendRedirect(request, response, frontendUrl);
    }
}
