package com.finflow.document.controller;

import com.finflow.document.entity.Document;
import com.finflow.document.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.util.List;

/**
 * REST controller for managing document uploads, retrievals, and verifications
 * associated with a specific loan application.
 */
@RestController
@RequestMapping("/documents")
public class DocumentController {

    @Autowired
    private DocumentService service;

    /**
     * Uploads a document file and links it to a given application ID.
     * 
     * @param applicationId The ID of the loan application.
     * @param fileType The type of the document (e.g., ID_PROOF, SALARY_SLIP).
     * @param file The physical file payload.
     * @return The created {@link Document} entity metadata.
     */
    @PostMapping(value = "/upload", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public Document uploadDocument(@RequestParam("applicationId") Long applicationId,
                                   @RequestParam("fileType") String fileType,
                                   @RequestParam("file") MultipartFile file) {
        return service.uploadDocument(applicationId, fileType, file);
    }

    /**
     * Retrieves all documents associated with a particular application ID.
     * 
     * @param applicationId The ID of the loan application.
     * @return List of {@link Document} records.
     */
    @GetMapping("/application/{applicationId}")
    public List<Document> getDocuments(@PathVariable Long applicationId) {
        return service.getDocumentsByApplication(applicationId);
    }

    /**
     * Verifies a specific document by updating its verification status.
     * 
     * @param id The unique identifier of the document.
     * @param status The target status (e.g., VERIFIED, REJECTED).
     * @return The updated {@link Document} entity.
     */
    @PutMapping("/{id}/verify")
    public Document verifyDocument(@PathVariable Long id, @RequestParam(value = "status", defaultValue = "VERIFIED") String status) {
        return service.verifyDocument(id, status);
    }

    @GetMapping("/{id}/view")
    public ResponseEntity<byte[]> viewDocument(@PathVariable Long id) {
        Document doc = service.getDocumentById(id);
        byte[] content = service.getFileContent(id);
        
        // Determine media type
        String fileName = doc.getFileName().toLowerCase();
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        if (fileName.endsWith(".pdf")) mediaType = MediaType.APPLICATION_PDF;
        else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) mediaType = MediaType.IMAGE_JPEG;
        else if (fileName.endsWith(".png")) mediaType = MediaType.IMAGE_PNG;

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + doc.getFileName() + "\"")
                .body(content);
    }
}
