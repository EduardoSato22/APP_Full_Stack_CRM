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

    public static DealResponse fromEntity(Deal d) {
        DealResponse r = new DealResponse();
        r.setId(d.getId());
        r.setTitle(d.getTitle());
        r.setValue(d.getValue());
        r.setProbability(d.getProbability());
        r.setStage(d.getStage());
        r.setExpectedCloseDate(d.getExpectedCloseDate());
        r.setClosedAt(d.getClosedAt());
        r.setLostReason(d.getLostReason());
        r.setNotes(d.getNotes());
        r.setCreatedAt(d.getCreatedAt());
        r.setUpdatedAt(d.getUpdatedAt());
        if (d.getCustomer() != null) {
            r.setCustomerId(d.getCustomer().getId());
            r.setCustomerName(d.getCustomer().getFirstName() + " " + d.getCustomer().getLastName());
        }
        if (d.getAssignedTo() != null) {
            r.setAssignedToId(d.getAssignedTo().getId());
            r.setAssignedToName(d.getAssignedTo().getName());
        }
        if (d.getCreatedBy() != null) r.setCreatedById(d.getCreatedBy().getId());
        if (d.getProducts() != null) {
            r.setProductIds(d.getProducts().stream().map(p -> p.getId()).toList());
        }
        return r;
    }
}