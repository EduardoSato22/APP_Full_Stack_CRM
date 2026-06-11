package com.retailflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopProductPoint {
    private Long id;
    private String name;
    private long dealCount;
}
