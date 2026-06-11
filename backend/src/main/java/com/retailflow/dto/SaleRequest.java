package com.retailflow.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class SaleRequest {
    @NotNull private Long customerId;
    @NotEmpty @Valid private List<SaleItemRequest> items;
    private LocalDateTime saleDate;
    private String notes;
}
