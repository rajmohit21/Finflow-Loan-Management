package com.finflow.auth.service;

import com.finflow.auth.dto.SignupRequest;
import com.finflow.auth.entity.User;
import com.finflow.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;

/**
 * Service class that handles business logic for user authentication,
 * registration, and token management.
 */
@Service
public class AuthService {

    @PostConstruct
    public void initAdmin() {
        System.out.println("Initializing Master Admin: mohitraj2180@gmail.com");
        try {
            User admin = repository.findByEmail("mohitraj2180@gmail.com")
                    .orElse(new User());
            
            admin.setName("Master Admin");
            admin.setEmail("mohitraj2180@gmail.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole("ADMIN");
            
            if (admin.getCreatedAt() == null) {
                admin.setCreatedAt(LocalDateTime.now());
            }
            
            repository.save(admin);
            System.out.println("Master Admin initialized successfully.");
        } catch (Exception e) {
            System.err.println("Failed to initialize Master Admin: " + e.getMessage());
        }
    }

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EmailService emailService;

    /**
     * Saves a new user to the database if the email does not already exist.
     * 
     * @param request The signup request containing user information.
     * @return A confirmation message.
     * @throws RuntimeException if the email is already registered.
     */
    public String saveUser(SignupRequest request) {
        String trimmedEmail = request.getEmail().trim().toLowerCase();
        // Check for existing user to prevent duplicates
        if (repository.findByEmailIgnoreCase(trimmedEmail).isPresent()) {
            throw new RuntimeException("User with this email already exists!");
        }
        
        // Initialize new user entity
        User user = new User();
        user.setName(request.getName());
        user.setEmail(trimmedEmail);
        // Hash the password for secure storage
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setCreatedAt(LocalDateTime.now());
        
        // Save user to repository
        User saved = repository.save(user);
        emailService.sendWelcomeEmail(saved.getEmail(), saved.getName());
        return "User added to the system";
    }

    /**
     * Generates a JWT token for the specified username.
     * 
     * @param username The username (email) for which to generate the token.
     * @return A signed JWT token string.
     */
    public String generateToken(String username) {
        String trimmedEmail = username.trim();
        User user = repository.findByEmailIgnoreCase(trimmedEmail).orElseThrow(() -> new RuntimeException("User not found"));
        emailService.sendLoginNotification(username);
        return jwtService.generateToken(username, user.getRole(), user.getId());
    }
    
    /**
     * Validates a given JWT token to ensure its authenticity and expiration status.
     * 
     * @param token The JWT token to validate.
     */
    public void validateToken(String token) {
        jwtService.validateToken(token);
    }

    public void forgotPassword(String email) {
        String trimmedEmail = email.trim();
        User user = repository.findByEmailIgnoreCase(trimmedEmail).orElseThrow(() -> new RuntimeException("Email not found"));
        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);
        
        user.setResetOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        repository.save(user);
        
        emailService.sendOtpEmail(email, otp);
    }

    public void resetPassword(String email, String otp, String newPassword) {
        String trimmedEmail = email.trim();
        User user = repository.findByEmailIgnoreCase(trimmedEmail).orElseThrow(() -> new RuntimeException("Email not found"));
        
        if (user.getResetOtp() == null || !user.getResetOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }
        
        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP Expired");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetOtp(null);
        user.setOtpExpiry(null);
        repository.save(user);
    }

    public User getUserById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public boolean checkUserExists(String email) {
        return repository.findByEmailIgnoreCase(email.trim()).isPresent();
    }
}
