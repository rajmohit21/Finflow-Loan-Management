package com.finflow.admin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        if (mailSender == null) {
            System.out.println("Email Service simulation (SMTP not configured):");
            System.out.println("To: " + to);
            System.out.println("Subject: " + subject);
            System.out.println("Body: " + body);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("finflow.demo@gmail.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendDecisionEmail(String to, Long appId, String status, String remarks) {
        String subject = "Update on your FinFlow Loan Application #" + appId;
        String body = String.format(
            "Dear Applicant,\n\n" +
            "Your loan application (#%d) status has been updated to: %s.\n\n" +
            "Reviewer Remarks: %s\n\n" +
            "Thank you for choosing FinFlow.\n" +
            "Best regards,\nFinFlow Team",
            appId, status, remarks
        );
        sendEmail(to, subject, body);
    }
}
