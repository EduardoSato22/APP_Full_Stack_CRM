package com.retailflow.dto;

import com.retailflow.model.Deal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class DealRequest {

    @NotBlank(message = "Título é obrigatório")
    private String title;

    private BigDecimal value;

    @NotNull(message = "Cliente é obrigatório")
    private Long customerId;

    private List<Long> productIds;
    private Deal.Stage stage;
    private LocalDateTime expectedCloseDate;
    private Long assignedToId;
    private String lostReason;
    private String notes;
}