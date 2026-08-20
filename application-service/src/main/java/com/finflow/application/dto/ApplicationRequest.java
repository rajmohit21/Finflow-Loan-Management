package com.finflow.application.dto;

import lombok.Data;

@Data
public class ApplicationRequest {
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
    private Double interestRate;
}
