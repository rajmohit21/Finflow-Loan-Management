package com.finflow.auth.controller;

import com.finflow.auth.dto.AuthRequest;
import com.finflow.auth.dto.SignupRequest;
import com.finflow.auth.dto.UserResponse;
import com.finflow.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

/**
 * REST controller responsible for handling authentication and user registration requests.
 * Provides endpoints for signup, login, and token validation.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthService service;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * Registers a new user in the system.
     * 
     * @param request The signup request containing user details.
     * @return A confirmation message.
     */
    @PostMapping("/signup")
    public String addNewUser(@Valid @RequestBody SignupRequest request) {
        // Delegate user creation to the AuthService
        return service.saveUser(request);
    }

    /**
     * Authenticates a user and generates a JWT token upon successful login.
     * 
     * @param authRequest The authentication request containing email and password.
     * @return The generated JWT token.
     * @throws RuntimeException if the authentication fails.
     */
    @PostMapping("/login")
    public String getToken(@Valid @RequestBody AuthRequest authRequest) {
        // Authenticate the user credentials against the AuthenticationManager
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
                
        if (authenticate.isAuthenticated()) {
            // Generate and return token if authentication is successful
            return service.generateToken(authRequest.getEmail());
        } else {
            throw new RuntimeException("invalid access");
        }
    }

    /**
     * Validates the provided JWT token.
     * 
     * @param token The JWT token to validate.
     * @return A message indicating whether the token is valid.
     */
    @GetMapping("/validate")
    public String validateToken(@RequestParam("token") String token) {
        service.validateToken(token);
        return "Token is valid";
    }


    @ExceptionHandler(RuntimeException.class)
    public org.springframework.http.ResponseEntity<String> handleRuntime(RuntimeException e) {
        return org.springframework.http.ResponseEntity.status(500).body(e.getMessage());
    }

    @GetMapping("/user/{id}")
    public UserResponse getUserById(@PathVariable Long id) {
        return UserResponse.from(service.getUserById(id));
    }
}
