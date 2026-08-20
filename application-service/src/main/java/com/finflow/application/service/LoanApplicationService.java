package com.finflow.application.service;

import com.finflow.application.dto.ApplicationRequest;
import com.finflow.application.entity.LoanApplication;
import com.finflow.application.repository.LoanApplicationRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service class handling the business logic for loan applications.
 * Manages creation, updating, submission, and querying of loan applications.
 */
@Service
public class LoanApplicationService {

    @Autowired
    private LoanApplicationRepository repository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private EmailService emailService;

    /**
    /**
     * Calculates the interest rate based on loan amount and purpose/type.
     * 
     * @param amount The requested loan amount.
     * @param loanPurpose The purpose of the loan.
     * @return Calculated interest rate as a Double.
     */
    public Double calculateInterestRate(Double amount, String loanPurpose) {
        if (amount == null) {
            return 9.0;
        }
        double baseRate;
        if (loanPurpose == null) {
            baseRate = 9.0;
        } else {
            String purpose = loanPurpose.trim().toLowerCase();
            if (purpose.contains("personal")) {
                baseRate = 10.5;
            } else if (purpose.contains("business")) {
                baseRate = 12.0;
            } else if (purpose.contains("education")) {
                baseRate = 6.5;
            } else if (purpose.contains("home") || purpose.contains("improvement")) {
                baseRate = 8.0;
            } else {
                baseRate = 9.0;
            }
        }

        // Adjust rate based on loan amount
        if (amount < 5000) {
            baseRate += 0.5; // Risk premium for small loans
        } else if (amount >= 25000 && amount < 100000) {
            baseRate -= 0.25; // Prime discount
        } else if (amount >= 100000) {
            baseRate -= 0.5; // Volume discount
        }

        return Math.round(baseRate * 100.0) / 100.0;
    }

    /**
     * Creates a new draft loan application.
     * 
     * @param request The data transfer object containing application details.
     * @return The saved {@link LoanApplication} entity with a DRAFT status.
     */
    public LoanApplication createApplication(ApplicationRequest request) {
        LoanApplication app = new LoanApplication();
        app.setUserId(request.getUserId());
        app.setEmail(request.getEmail());
        
        // Personal
        app.setFullName(request.getFullName());
        app.setPhone(request.getPhone());
        app.setAddress(request.getAddress());
        
        // Employment
        app.setEmployerName(request.getEmployerName());
        app.setJobTitle(request.getJobTitle());
        app.setAnnualIncome(request.getAnnualIncome());
        
        // Loan
        app.setLoanAmount(request.getLoanAmount());
        app.setLoanPurpose(request.getLoanPurpose());
        app.setLoanTermMonths(request.getLoanTermMonths());
        
        // Dynamic Interest Calculation
        app.setInterestRate(calculateInterestRate(request.getLoanAmount(), request.getLoanPurpose()));
        
        app.setStatus("DRAFT");
        app.setCreatedAt(LocalDateTime.now());
        
        return repository.save(app);
    }

    public LoanApplication updateApplication(Long id, ApplicationRequest request) {
        LoanApplication app = repository.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
        
        app.setFullName(request.getFullName());
        app.setPhone(request.getPhone());
        app.setAddress(request.getAddress());
        app.setEmail(request.getEmail());
        app.setEmployerName(request.getEmployerName());
        app.setJobTitle(request.getJobTitle());
        app.setAnnualIncome(request.getAnnualIncome());
        app.setLoanAmount(request.getLoanAmount());
        app.setLoanPurpose(request.getLoanPurpose());
        app.setLoanTermMonths(request.getLoanTermMonths());
        
        // Dynamic Interest Recalculation
        app.setInterestRate(calculateInterestRate(request.getLoanAmount(), request.getLoanPurpose()));
        
        app.setUpdatedAt(LocalDateTime.now());
        
        return repository.save(app);
    }

    public void submitApplication(Long id) {
        LoanApplication app = repository.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus("SUBMITTED");
        app.setUpdatedAt(LocalDateTime.now());
        repository.save(app);
        
        rabbitTemplate.convertAndSend("finflow.exchange", "application.submitted", "Application Submitted: " + id);
        
        if (app.getEmail() != null) {
            emailService.sendApplicationSubmittedEmail(app.getEmail(), id);
        }
    }
    
    public List<LoanApplication> getMyApplications(Long userId, String email) {
        List<LoanApplication> apps = repository.findByUserId(userId);
        if (apps.isEmpty() && email != null) {
            return repository.findByEmail(email);
        }
        return apps;
    }

    public List<LoanApplication> getAllApplications() {
        return repository.findAll();
    }

    public String getApplicationStatus(Long id) {
        return repository.findById(id)
                .map(LoanApplication::getStatus)
                .orElse("NOT_FOUND");
    }

    public void updateApplicationStatus(Long id, String status, String remarks) {
        LoanApplication app = repository.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(status);
        if (remarks != null) {
            app.setRemarks(remarks);
        }
        app.setUpdatedAt(LocalDateTime.now());
        repository.save(app);

        if (app.getEmail() != null && (status.equalsIgnoreCase("APPROVED") || status.equalsIgnoreCase("REJECTED"))) {
            emailService.sendDecisionEmail(app.getEmail(), id, status, remarks);
        }
    }

    /**
     * Retrieves a single loan application by its ID.
     * 
     * @param id The application ID.
     * @return The found application.
     */
    public LoanApplication getApplicationById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
    }
}
