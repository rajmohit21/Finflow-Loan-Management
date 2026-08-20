package com.finflow.auth.service;

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
            System.out.println("Email Simulation (Signup/Login): To=" + to + ", Subject=" + subject);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("mohitraj2180@gmail.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Mail failed: " + e.getMessage());
            throw new RuntimeException("Email delivery failed: " + e.getMessage());
        }
    }

    public void sendWelcomeEmail(String to, String name) {
        sendEmail(to, "Welcome to FinFlow!", "Dear " + name + ",\n\nWelcome to FinFlow Loan Management System. Your account has been created successfully.\n\nRegards,\nFinFlow Team");
    }

    public void sendLoginNotification(String to) {
        sendEmail(to, "New Login Detected", "Hello,\n\nA new login was detected for your FinFlow account. If this wasn't you, please reset your password.\n\nRegards,\nFinFlow Team");
    }

    public void sendOtpEmail(String to, String otp) {
        sendEmail(to, "Your Password Reset OTP", "Hello,\n\nYour OTP for password reset is: " + otp + "\n\nThis OTP is valid for 10 minutes.\n\nRegards,\nFinFlow Team");
    }
}
