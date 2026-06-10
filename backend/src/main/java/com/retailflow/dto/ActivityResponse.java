package com.retailflow.dto;

import com.retailflow.model.Activity;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ActivityResponse {
    private Long id;
    private Activity.Type type;
    private String title;
    private String description;
    private Long customerId;
    private String customerName;
    private Long dealId;
    private String dealTitle;
    private LocalDateTime dueDate;
    private LocalDateTime completedAt;
    private Long assignedToId;
    private String assignedToName;
    private Long createdById;
    private Activity.Priority priority;
    private Activity.Status status;
    private LocalDateTime createdAt;
}