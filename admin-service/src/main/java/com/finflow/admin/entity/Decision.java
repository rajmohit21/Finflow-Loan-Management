package com.finflow.admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "decisions")
public class Decision {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long applicationId;
    private String decisionType;
    private String remarks;
    private Long decidedBy;
    private LocalDateTime decidedAt = LocalDateTime.now();
}
