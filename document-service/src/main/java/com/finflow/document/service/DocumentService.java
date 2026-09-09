package com.finflow.document.service;

import com.finflow.document.entity.Document;
import com.finflow.document.repository.DocumentRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository repository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private final String UPLOAD_DIR = "uploads/";

    public Document uploadDocument(Long applicationId, String fileType, MultipartFile file) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Document doc = new Document();
            doc.setApplicationId(applicationId);
            doc.setFileName(file.getOriginalFilename());
            doc.setFileType(fileType);
            doc.setFilePath(filePath.toString());
            doc.setStatus("PENDING");
            doc.setUploadedAt(LocalDateTime.now());
            
            Document saved = repository.save(doc);
            rabbitTemplate.convertAndSend("finflow.exchange", "document.uploaded", "Document Uploaded: " + saved.getId());
            return saved;
        } catch (Exception e) {
            throw new RuntimeException("Could not store file", e);
        }
    }

    public List<Document> getDocumentsByApplication(Long applicationId) {
        return repository.findByApplicationId(applicationId);
    }

    public Document verifyDocument(Long id, String status) {
        Document doc = repository.findById(id).orElseThrow(() -> new RuntimeException("Document not found"));
        doc.setStatus(status);
        doc.setVerifiedAt(LocalDateTime.now());
        
        Document saved = repository.save(doc);
        rabbitTemplate.convertAndSend("finflow.exchange", "document.verified", "Document Verified: " + id + " Status: " + status);
        return saved;
    }
    public Document getDocumentById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Document not found"));
    }

    public byte[] getFileContent(Long id) {
        try {
            Document doc = repository.findById(id).orElseThrow(() -> new RuntimeException("Document not found"));
            return Files.readAllBytes(Paths.get(doc.getFilePath()));
        } catch (Exception e) {
            throw new RuntimeException("Could not read file", e);
        }
    }
}
