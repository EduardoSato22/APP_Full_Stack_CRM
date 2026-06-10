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

    public static ProductResponse fromEntity(Product p) {
        ProductResponse r = new ProductResponse();
        r.setId(p.getId());
        r.setName(p.getName());
        r.setDescription(p.getDescription());
        r.setPrice(p.getPrice());
        r.setCostPrice(p.getCostPrice());
        r.setMargin(p.getMargin());
        r.setSku(p.getSku());
        r.setStock(p.getStock());
        r.setUnit(p.getUnit());
        r.setStatus(p.getStatus());
        r.setImageUrl(p.getImageUrl());
        r.setCreatedAt(p.getCreatedAt());
        r.setLastUpdated(p.getLastUpdated());
        if (p.getUser() != null) r.setUserId(p.getUser().getId());
        if (p.getCategory() != null) {
            r.setCategoryId(p.getCategory().getId());
            r.setCategoryName(p.getCategory().getName());
        }
        return r;
    }
}