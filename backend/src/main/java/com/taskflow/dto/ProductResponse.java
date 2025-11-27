package com.taskflow.dto;

import com.taskflow.model.Product;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl; 
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdated;
    private Long userId;

    public static ProductResponse fromEntity(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        
        response.setImageUrl(product.getImageUrl());

        response.setCreatedAt(product.getCreatedAt());
        response.setLastUpdated(product.getLastUpdated());
        if (product.getUser() != null) {
            response.setUserId(product.getUser().getId());
        }
        return response;
    }
}