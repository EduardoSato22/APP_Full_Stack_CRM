package com.retailflow.dto;

import com.retailflow.model.Product;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal costPrice;
    private BigDecimal margin;
    private String sku;
    private Integer stock;
    private Product.Unit unit;
    private Product.Status status;
    private Long categoryId;
    private String categoryName;
    private String imageUrl;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdated;
}