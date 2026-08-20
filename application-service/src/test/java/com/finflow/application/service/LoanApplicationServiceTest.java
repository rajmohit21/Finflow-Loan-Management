package com.finflow.application.service;

import com.finflow.application.dto.ApplicationRequest;
import com.finflow.application.entity.LoanApplication;
import com.finflow.application.repository.LoanApplicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class LoanApplicationServiceTest {

    @Mock
    private LoanApplicationRepository repository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private LoanApplicationService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateApplication() {
        ApplicationRequest request = new ApplicationRequest();
        request.setUserId(1L);
        request.setLoanAmount(10000.0);

        LoanApplication app = new LoanApplication();
        app.setId(100L);
        app.setUserId(1L);

        when(repository.save(any(LoanApplication.class))).thenReturn(app);

        LoanApplication result = service.createApplication(request);

        assertEquals(100L, result.getId());
        verify(repository, times(1)).save(any(LoanApplication.class));
    }

    @Test
    void testSubmitApplication() {
        LoanApplication app = new LoanApplication();
        app.setId(100L);
        app.setStatus("DRAFT");

        when(repository.findById(100L)).thenReturn(Optional.of(app));
        when(repository.save(any(LoanApplication.class))).thenReturn(app);

        service.submitApplication(100L);

        assertEquals("SUBMITTED", app.getStatus());
        verify(rabbitTemplate, times(1)).convertAndSend(anyString(), anyString(), anyString());
    }
}
