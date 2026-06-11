package com.retailflow.dto;

import com.retailflow.model.Sale;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class SaleResponse {
    private Long id;
    private Long customerId;
    private String customerName;
    private Long createdById;
    private String createdByName;
    private Sale.Status status;
    private BigDecimal total;
    private LocalDateTime saleDate;
    private String notes;
    private LocalDateTime createdAt;
    private List<SaleItemResponse> items;

    public static SaleResponse fromEntity(Sale sale) {
        SaleResponse r = new SaleResponse();
        r.id = sale.getId();
        r.customerId = sale.getCustomer().getId();
        r.customerName = sale.getCustomer().getFirstName() + " " + sale.getCustomer().getLastName();
        r.createdById = sale.getCreatedBy().getId();
        r.createdByName = sale.getCreatedBy().getName();
        r.status = sale.getStatus();
        r.total = sale.getTotal();
        r.saleDate = sale.getSaleDate();
        r.notes = sale.getNotes();
        r.createdAt = sale.getCreatedAt();
        r.items = sale.getItems().stream().map(SaleItemResponse::fromEntity).toList();
        return r;
    }
}
