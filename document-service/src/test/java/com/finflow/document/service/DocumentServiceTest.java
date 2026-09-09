package com.finflow.document.service;

import com.finflow.document.entity.Document;
import com.finflow.document.repository.DocumentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.mock.web.MockMultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DocumentServiceTest {

    @Mock
    private DocumentRepository repository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private DocumentService documentService;

    @Test
    void testUploadDocument() {
        MockMultipartFile mockFile = new MockMultipartFile(
                "file",
                "test.txt",
                "text/plain",
                "Test content".getBytes()
        );

        Document doc = new Document();
        doc.setId(1L);
        doc.setApplicationId(10L);
        doc.setFileName("test.txt");

        when(repository.save(any(Document.class))).thenReturn(doc);

        Document result = documentService.uploadDocument(10L, "IDENTITY", mockFile);

        assertNotNull(result);
        assertEquals("test.txt", result.getFileName());
        verify(repository, times(1)).save(any(Document.class));
        verify(rabbitTemplate, times(1)).convertAndSend(eq("finflow.exchange"), eq("document.uploaded"), any(String.class));
    }

    @Test
    void testGetDocumentsByApplication() {
        Document d1 = new Document();
        Document d2 = new Document();
        when(repository.findByApplicationId(1L)).thenReturn(Arrays.asList(d1, d2));

        List<Document> docs = documentService.getDocumentsByApplication(1L);

        assertEquals(2, docs.size());
        verify(repository, times(1)).findByApplicationId(1L);
    }

    @Test
    void testVerifyDocument() {
        Document doc = new Document();
        doc.setId(5L);
        doc.setStatus("PENDING");

        when(repository.findById(5L)).thenReturn(Optional.of(doc));
        when(repository.save(any(Document.class))).thenReturn(doc);

        Document result = documentService.verifyDocument(5L, "VERIFIED");

        assertEquals("VERIFIED", result.getStatus());
        verify(repository, times(1)).findById(5L);
        verify(repository, times(1)).save(doc);
        verify(rabbitTemplate, times(1)).convertAndSend(eq("finflow.exchange"), eq("document.verified"), any(String.class));
    }
}
