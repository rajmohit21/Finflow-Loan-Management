package com.finflow.application.controller;

import com.finflow.application.dto.ApplicationRequest;
import com.finflow.application.entity.LoanApplication;
import com.finflow.application.service.LoanApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

/**
 * REST controller for handling loan application operations.
 * Exposes endpoints to create, submit, update, review, and track applications.
 */
@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private LoanApplicationService service;

    /**
     * Creates a new draft loan application.
     *
     * @param request The application details in JSON format.
     * @return The created {@link LoanApplication} object.
     */
    @PostMapping
    public LoanApplication create(@RequestBody ApplicationRequest request, @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {
        // Prioritize header from Gateway, fallback to DTO body
        if (headerUserId != null && !headerUserId.trim().isEmpty() && !headerUserId.trim().equals("null")) {
            request.setUserId(Long.parseLong(headerUserId.trim()));
        }
        return service.createApplication(request);
    }

    /**
     * Admin endpoint. Retrieves all registered loan applications.
     *
     * @return List of all {@link LoanApplication} entities.
     */
    @GetMapping
    public List<LoanApplication> getAllApplications() {
        return service.getAllApplications();
    }

    /**
     * Updates an existing loan application (e.g., adding missing info).
     *
     * @param id The ID of the application to update.
     * @param request The new data to apply to the application.
     * @return The updated {@link LoanApplication} entity.
     */
    @PutMapping("/{id}")
    public LoanApplication update(@PathVariable Long id, @RequestBody ApplicationRequest request) {
        return service.updateApplication(id, request);
    }

    /**
     * Submits a draft application for processing.
     *
     * @param id The ID of the application that the user wants to submit.
     * @return A standard success message upon successful submission.
     */
    @PostMapping("/{id}/submit")
    public ResponseEntity<Map<String, String>> submit(@PathVariable Long id) {
        service.submitApplication(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Application submitted successfully");
        response.put("status", "SUBMITTED");
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieves applications associated with the logged-in user.
     *
     * @return List of {@link LoanApplication} belonging to the user.
     */
    @GetMapping("/user")
    public List<LoanApplication> getMyApplications(@RequestHeader("X-User-Id") String userId, @RequestHeader(value = "X-User-Email", required = false) String email) {
        return service.getMyApplications(Long.parseLong(userId), email);
    }

    /**
     * Fetches the current status of an application.
     *
     * @param id The ID of the application to check.
     * @return The status as a string (e.g., DRAFT, SUBMITTED, APPROVED).
     */
    @GetMapping("/{id}/status")
    public String getStatus(@PathVariable Long id) {
        return service.getApplicationStatus(id);
    }

    /**
     * Updates the status of an application.
     *
     * @param id The ID of the application.
     * @param status The new status string.
     */
    @PutMapping("/{id}/status")
    public String updateStatus(@PathVariable Long id, @RequestParam String status, @RequestParam(required = false) String remarks) {
        service.updateApplicationStatus(id, status, remarks);
        return "Status updated to " + status;
    }

    /**
     * Retrieves a single loan application by ID.
     * 
     * @param id The application ID.
     * @return The {@link LoanApplication} entity.
     */
    @GetMapping("/{id}")
    public LoanApplication getById(@PathVariable Long id) {
        return service.getApplicationById(id);
    }

    /**
     * Estimates the interest rate based on loan amount and type.
     * 
     * @param amount The requested loan amount.
     * @param purpose The type/purpose of the loan.
     * @return The calculated interest rate value.
     */
    @GetMapping("/calculate-rate")
    public ResponseEntity<Double> estimateInterestRate(@RequestParam Double amount, @RequestParam String purpose) {
        Double rate = service.calculateInterestRate(amount, purpose);
        return ResponseEntity.ok(rate);
    }
}
