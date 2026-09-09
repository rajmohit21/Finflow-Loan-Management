package com.finflow.document.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "documents")
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long applicationId;
    private String fileName;
    private String fileType;
    private String filePath;
    private String status;
    
    private LocalDateTime uploadedAt = LocalDateTime.now();
    private LocalDateTime verifiedAt;
}
