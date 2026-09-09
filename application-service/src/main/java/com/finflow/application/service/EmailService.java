package com.finflow.application.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendApplicationSubmittedEmail(String toEmail, Long applicationId) {
        String subject = "Loan Application Submitted - #" + applicationId;
        String body = "Dear Applicant,\n\n" +
                "Your loan application (ID: " + applicationId + ") has been received successfully.\n" +
                "Our team will now review your documents and details.\n\n" +
                "You can track your status in the Borrower Portal.\n\n" +
                "Best Regards,\nFinFlow Team";
        sendEmail(toEmail, subject, body);
    }

    public void sendDecisionEmail(String toEmail, Long applicationId, String status, String remarks) {
        String subject = "Update on your Loan Application - #" + applicationId;
        String outcome = status.equalsIgnoreCase("APPROVED") ? "CONGRATULATIONS! Your loan has been APPROVED." : "We regret to inform you that your loan application has been REJECTED.";
        
        String body = "Dear Applicant,\n\n" +
                outcome + "\n\n" +
                "Decision Details:\n" +
                "Status: " + status + "\n" +
                "Reviewer Remarks: " + (remarks != null ? remarks : "N/A") + "\n\n" +
                "Log in to your dashboard for further instructions.\n\n" +
                "Best Regards,\nFinFlow Team";
        sendEmail(toEmail, subject, body);
    }

    public void sendDocumentUpdateEmail(String toEmail, Long applicationId, String docType, String status) {
        String subject = "Document Verification Update - #" + applicationId;
        String body = "Dear Applicant,\n\n" +
                "There is an update regarding your uploaded document: " + docType + ".\n" +
                "Current Status: " + status + "\n\n" +
                (status.equalsIgnoreCase("REJECTED") ? "Please re-upload a clear copy of the document in the portal.\n\n" : "") +
                "Best Regards,\nFinFlow Team";
        sendEmail(toEmail, subject, body);
    }

    private void sendEmail(String to, String subject, String text) {
        if (mailSender == null) {
            log.info("Email Simulation [To: {}]: {} \nContent: {}", to, subject, text);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("mohitraj2180@gmail.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            log.info("Email sent to {}", to);
        } catch (Exception e) {
            log.error("SMTP Error sending to {}: {}", to, e.getMessage());
            throw new RuntimeException("Email delivery failed: " + e.getMessage());
        }
    }
}
