package com.finflow.auth.config;

import com.finflow.auth.entity.User;
import com.finflow.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (repository.findByEmail("admin@finflow.com").isEmpty()) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@finflow.com");
            admin.setPassword(passwordEncoder.encode("password123"));
            admin.setRole("ADMIN");
            repository.save(admin);
            System.out.println("Seeded admin user.");
        }

        if (repository.findByEmail("rahul.sharma@example.com").isEmpty()) {
            User user = new User();
            user.setName("Rahul Sharma");
            user.setEmail("rahul.sharma@example.com");
            user.setPassword(passwordEncoder.encode("password123"));
            user.setRole("USER");
            repository.save(user);
            System.out.println("Seeded applicant user.");
        }
        
        if (repository.findByEmail("applicant_demo@finflow.com").isEmpty()) {
            User user2 = new User();
            user2.setName("Applicant Demo");
            user2.setEmail("applicant_demo@finflow.com");
            user2.setPassword(passwordEncoder.encode("password123"));
            user2.setRole("USER");
            repository.save(user2);
            System.out.println("Seeded applicant demo user.");
        }
    }
}
