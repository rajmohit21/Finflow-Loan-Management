package com.finflow.auth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Entity representing a registered user in the FinFlow system.
 * Contains core authentication credentials and role assignments.
 */
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Column(unique = true)
    private String email;
    
    // Stored as an encoded hash
    private String password;
    
    // e.g., "USER" or "ADMIN"
    private String role;
    
    private LocalDateTime createdAt = LocalDateTime.now();

    private String resetOtp;
    private LocalDateTime otpExpiry;
}
