package com.retailflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class PipelineFunnelStage {
    private String stage;
    private String label;
    private long count;
    private BigDecimal value;
}
