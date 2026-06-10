package com.retailflow.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;

@Data
public class DashboardSummary {
    private long totalCustomers;
    private long newCustomersThisMonth;
    private long activeDeals;
    private BigDecimal totalPipelineValue;
    private long wonDealsThisMonth;
    private BigDecimal wonRevenueThisMonth;
    private double conversionRate;
    private long activitiesPendingToday;
    private Map<String, Long> dealsByStage;
    private Map<String, BigDecimal> revenueByMonth;
}