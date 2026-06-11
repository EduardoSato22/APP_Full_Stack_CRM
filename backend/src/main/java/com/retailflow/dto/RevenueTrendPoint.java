package com.retailflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class RevenueTrendPoint {
    private String month;
    private BigDecimal revenue;
}
