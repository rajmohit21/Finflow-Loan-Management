package com.finflow.admin.controller;

import com.finflow.admin.entity.Decision;
import com.finflow.admin.entity.Report;
import com.finflow.admin.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;

/**
 * REST controller for administrative operations.
 * Allows administrators to manage applications, view reports, and manage users.
 */
@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService service;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private com.finflow.admin.service.EmailService emailService;

    /**
     * Retrieves all loan applications by calling the Application Service.
     * 
     * @return An object containing a list of applications.
     */
    @GetMapping("/applications")
    public Object getAllApplications() {
        return restTemplate.getForObject("http://APPLICATION-SERVICE/applications", Object.class);
    }

    /**
     * Submits an administrative decision (e.g., APPROVE, REJECT) for a specific application.
     * 
     * @param id The ID of the application.
     * @param decision The decision details.
     * @return The saved {@link Decision} entity.
     */
    @PostMapping("/applications/{id}/decision")
    public Decision makeDecision(@PathVariable Long id, @RequestBody Decision decision) {
        decision.setApplicationId(id);

        String remarks = decision.getRemarks() != null ? decision.getRemarks() : "";

        URI statusUri = UriComponentsBuilder
                .fromUriString("http://APPLICATION-SERVICE/applications/{id}/status")
                .queryParam("status", decision.getDecisionType())
                .queryParam("remarks", remarks)
                .build(id);

        restTemplate.put(statusUri, null);

        Decision savedDecision = service.saveDecision(decision);

        try {
            ParameterizedTypeReference<Map<String, Object>> appTypeRef = new ParameterizedTypeReference<>() {};
            Map<String, Object> appMap = restTemplate.exchange(
                "http://APPLICATION-SERVICE/applications/" + id,
                HttpMethod.GET,
                null,
                appTypeRef
            ).getBody();

            if (appMap != null) {
                Long userId = Long.valueOf(appMap.get("userId").toString());
                String userEmail = getUserEmail(userId);
                if (userEmail != null) {
                    emailService.sendDecisionEmail(userEmail, id, decision.getDecisionType(), remarks);
                }
            }
        } catch (Exception e) {
            System.err.println("Decision saved, but email notification failed: " + e.getMessage());
        }
        return savedDecision;
    }

    private String getUserEmail(Long userId) {
        try {
            ParameterizedTypeReference<Map<String, Object>> typeRef = new ParameterizedTypeReference<>() {};
            Map<String, Object> user = restTemplate.exchange(
                "http://AUTH-SERVICE/auth/user/" + userId,
                HttpMethod.GET,
                null,
                typeRef
            ).getBody();
            return user != null ? (String) user.get("email") : null;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Verifies a document by calling the Document Service.
     * 
     * @param id The ID of the document to verify.
     * @return The updated document metadata object.
     */
    @PutMapping("/documents/{id}/verify")
    public Object verifyDocument(@PathVariable Long id, @RequestParam(value = "status", defaultValue = "VERIFIED") String status) {
        URI uri = UriComponentsBuilder
                .fromUriString("http://DOCUMENT-SERVICE/documents/{id}/verify")
                .queryParam("status", status)
                .build(id);
        restTemplate.put(uri, null);
        return "Document " + status.toLowerCase();
    }

    /**
     * Updates an application status directly.
     */
    @PutMapping("/applications/{id}/status")
    public String updateApplicationStatus(@PathVariable Long id, @RequestParam String status) {
        URI statusUri = UriComponentsBuilder
                .fromUriString("http://APPLICATION-SERVICE/applications/{id}/status")
                .queryParam("status", status)
                .build(id);

        restTemplate.put(statusUri, null);

        Decision decision = new Decision();
        decision.setApplicationId(id);
        decision.setDecisionType(status);
        service.saveDecision(decision);

        return "Status updated to " + status;
    }

    /**
     * Generates and retrieves all reports in the system.
     * 
     * @return List of {@link Report} objects.
     */
    @GetMapping("/reports")
    public List<Report> getReports() {
        return service.getAllReports();
    }
}
