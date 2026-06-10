package com.retailflow.dto;

import com.retailflow.model.Deal;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class DealResponse {
    private Long id;
    private String title;
    private BigDecimal value;
    private Integer probability;
    private Deal.Stage stage;
    private Long customerId;
    private String customerName;
    private List<Long> productIds;
    private LocalDateTime expectedCloseDate;
    private LocalDateTime closedAt;
    private Long assignedToId;
    private String assignedToName;
    private Long createdById;
    private String lostReason;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}