package com.taskflow.dto;

import com.taskflow.model.Customer;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CustomerRequest {

    @NotBlank(message = "Nome é obrigatório")
    private String firstName;

    @NotBlank(message = "Sobrenome é obrigatório")
    private String lastName;

    @Email(message = "Email inválido")
    @NotBlank(message = "Email é obrigatório")
    private String email;

    private Integer age;
    private String phone;
    private String company;
    private String position;
    private String photoUrl;

    // Address
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;

    private Customer.Status status;
    private Customer.Source source;
    private List<String> tags;
    private String notes;

    private Long assignedToId;
    private LocalDateTime nextFollowUpDate;
}