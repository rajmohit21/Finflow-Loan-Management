package com.finflow.admin.service;

import com.finflow.admin.entity.Decision;
import com.finflow.admin.entity.Report;
import com.finflow.admin.repository.DecisionRepository;
import com.finflow.admin.repository.ReportRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AdminServiceTest {

    @Mock
    private DecisionRepository decisionRepository;

    @Mock
    private ReportRepository reportRepository;

    @InjectMocks
    private AdminService adminService;

    @Test
    void testSaveDecision() {
        Decision decision = new Decision();
        when(decisionRepository.save(any(Decision.class))).thenReturn(decision);

        Decision result = adminService.saveDecision(decision);

        assertNotNull(result);
        verify(decisionRepository, times(1)).save(decision);
    }

    @Test
    void testGetAllReports() {
        Report report1 = new Report();
        Report report2 = new Report();
        when(reportRepository.findAll()).thenReturn(Arrays.asList(report1, report2));

        List<Report> results = adminService.getAllReports();

        assertEquals(2, results.size());
        verify(reportRepository, times(1)).findAll();
    }
}
