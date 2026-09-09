package com.finflow.application.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "loan_applications")
public class LoanApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_id")
    private Long userId;
    
    // Personal Details
    private String fullName;
    private String phone;
    private String address;
    
    // Employment Details
    private String employerName;
    private String jobTitle;
    private Double annualIncome;
    
    // Loan Details
    private Double loanAmount;
    private String loanPurpose;
    private Integer loanTermMonths;
    
    private String email;
    private String status;
    private String remarks;
    private Double interestRate;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
}
