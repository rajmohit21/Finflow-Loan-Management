package com.finflow.admin.service;

import com.finflow.admin.entity.Report;
import com.finflow.admin.repository.ReportRepository;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AdminEventConsumer {

    @Autowired
    private ReportRepository reportRepository;

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "admin_report_queue", durable = "true"),
            exchange = @Exchange(value = "finflow.exchange", type = "topic", ignoreDeclarationExceptions = "true"),
            key = "application.*"
    ))
    public void handleApplicationEvent(String message) {
        Report report = new Report();
        report.setEventType("APPLICATION_EVENT");
        report.setDescription(message);
        report.setCreatedAt(LocalDateTime.now());
        reportRepository.save(report);
    }

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "admin_document_queue", durable = "true"),
            exchange = @Exchange(value = "finflow.exchange", type = "topic", ignoreDeclarationExceptions = "true"),
            key = "document.*"
    ))
    public void handleDocumentEvent(String message) {
        Report report = new Report();
        report.setEventType("DOCUMENT_EVENT");
        report.setDescription(message);
        report.setCreatedAt(LocalDateTime.now());
        reportRepository.save(report);
    }
}
