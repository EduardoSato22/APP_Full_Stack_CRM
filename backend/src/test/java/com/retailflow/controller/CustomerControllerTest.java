package com.retailflow.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.retailflow.dto.CustomerRequest;
import com.retailflow.dto.CustomerResponse;
import com.retailflow.service.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CustomerControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @MockBean CustomerService customerService;

    private CustomerResponse response;

    @BeforeEach
    void setUp() {
        response = new CustomerResponse();
        response.setId(1L);
        response.setFullName("João Silva");
        response.setEmail("joao@test.com");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void listCustomers_returns200WithPage() throws Exception {
        when(customerService.list(any(), any(), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(response)));

        mockMvc.perform(get("/api/customers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].fullName").value("João Silva"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createCustomer_returns201() throws Exception {
        CustomerRequest request = new CustomerRequest();
        request.setFirstName("João");
        request.setLastName("Silva");
        request.setEmail("joao@test.com");

        when(customerService.create(any(CustomerRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getCustomerById_returns200() throws Exception {
        when(customerService.findById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/customers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("joao@test.com"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteCustomer_returns204() throws Exception {
        mockMvc.perform(delete("/api/customers/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createCustomer_withMissingEmail_returns400() throws Exception {
        CustomerRequest request = new CustomerRequest();
        request.setFirstName("João");
        // email is @NotBlank, so missing email triggers validation

        mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void listCustomers_withoutAuth_returns401or403() throws Exception {
        mockMvc.perform(get("/api/customers"))
                .andExpect(status().is4xxClientError());
    }
}
