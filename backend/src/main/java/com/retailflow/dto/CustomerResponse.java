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

    public static CustomerResponse fromEntity(Customer c) {
        CustomerResponse r = new CustomerResponse();
        r.setId(c.getId());
        r.setFirstName(c.getFirstName());
        r.setLastName(c.getLastName());
        r.setFullName(c.getFirstName() + " " + c.getLastName());
        r.setEmail(c.getEmail());
        r.setAge(c.getAge());
        r.setPhone(c.getPhone());
        r.setCompany(c.getCompany());
        r.setPosition(c.getPosition());
        r.setPhotoUrl(c.getPhotoUrl());
        r.setStreet(c.getStreet());
        r.setCity(c.getCity());
        r.setState(c.getState());
        r.setZipCode(c.getZipCode());
        r.setCountry(c.getCountry());
        r.setStatus(c.getStatus());
        r.setSource(c.getSource());
        r.setTags(c.getTags());
        r.setNotes(c.getNotes());
        r.setTotalRevenue(c.getTotalRevenue());
        r.setLastContactDate(c.getLastContactDate());
        r.setNextFollowUpDate(c.getNextFollowUpDate());
        r.setCreatedAt(c.getCreatedAt());
        r.setUpdatedAt(c.getUpdatedAt());
        if (c.getUser() != null) r.setUserId(c.getUser().getId());
        if (c.getAssignedTo() != null) {
            r.setAssignedToId(c.getAssignedTo().getId());
            r.setAssignedToName(c.getAssignedTo().getName());
        }
        return r;
    }
}