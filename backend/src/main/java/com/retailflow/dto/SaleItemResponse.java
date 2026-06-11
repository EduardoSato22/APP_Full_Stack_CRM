package com.retailflow.dto;

import com.retailflow.model.SaleItem;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class SaleItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;

    public static SaleItemResponse fromEntity(SaleItem item) {
        SaleItemResponse r = new SaleItemResponse();
        r.id = item.getId();
        r.productId = item.getProduct().getId();
        r.productName = item.getProduct().getName();
        r.quantity = item.getQuantity();
        r.unitPrice = item.getUnitPrice();
        r.subtotal = item.getSubtotal();
        return r;
    }
}
