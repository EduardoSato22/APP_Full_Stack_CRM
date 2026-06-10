package com.retailflow.dto;

import com.retailflow.model.Customer;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CustomerResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private Integer age;
    private String phone;
    private String company;
    private String position;
    private String photoUrl;
    private String street, city, state, zipCode, country;
    private Customer.Status status;
    private Customer.Source source;
    private List<String> tags;
    private String notes;
    private Long userId;
    private Long assignedToId;
    private String assignedToName;
    private BigDecimal totalRevenue;
    private LocalDateTime lastContactDate;
    private LocalDateTime nextFollowUpDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}