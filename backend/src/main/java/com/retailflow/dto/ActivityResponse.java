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

    public static ActivityResponse fromEntity(Activity a) {
        ActivityResponse r = new ActivityResponse();
        r.setId(a.getId());
        r.setType(a.getType());
        r.setTitle(a.getTitle());
        r.setDescription(a.getDescription());
        r.setDueDate(a.getDueDate());
        r.setCompletedAt(a.getCompletedAt());
        r.setPriority(a.getPriority());
        r.setStatus(a.getStatus());
        r.setCreatedAt(a.getCreatedAt());
        if (a.getCustomer() != null) {
            r.setCustomerId(a.getCustomer().getId());
            r.setCustomerName(a.getCustomer().getFirstName() + " " + a.getCustomer().getLastName());
        }
        if (a.getDeal() != null) {
            r.setDealId(a.getDeal().getId());
            r.setDealTitle(a.getDeal().getTitle());
        }
        if (a.getAssignedTo() != null) {
            r.setAssignedToId(a.getAssignedTo().getId());
            r.setAssignedToName(a.getAssignedTo().getName());
        }
        if (a.getCreatedBy() != null) r.setCreatedById(a.getCreatedBy().getId());
        return r;
    }
}