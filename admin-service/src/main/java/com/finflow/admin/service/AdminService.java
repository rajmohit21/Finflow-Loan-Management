package com.finflow.admin.service;

import com.finflow.admin.entity.Decision;
import com.finflow.admin.entity.Report;
import com.finflow.admin.repository.DecisionRepository;
import com.finflow.admin.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private DecisionRepository decisionRepository;

    @Autowired
    private ReportRepository reportRepository;

    public Decision saveDecision(Decision decision) {
        return decisionRepository.save(decision);
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }
}
