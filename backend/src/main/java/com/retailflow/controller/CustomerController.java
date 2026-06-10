package com.retailflow.controller;

import com.retailflow.dto.CustomerRequest;
import com.retailflow.dto.CustomerResponse;
import com.retailflow.model.Customer;
import com.retailflow.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Clientes")
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    @Operation(summary = "Listar clientes")
    public ResponseEntity<Page<CustomerResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Customer.Status status,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(customerService.list(search, status, pageable));
    }

    @PostMapping
    @Operation(summary = "Criar cliente")
    public ResponseEntity<CustomerResponse> create(@Valid @RequestBody CustomerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(customerService.create(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar cliente")
    public ResponseEntity<CustomerResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.findById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar cliente")
    public ResponseEntity<CustomerResponse> update(@PathVariable Long id, @Valid @RequestBody CustomerRequest request) {
        return ResponseEntity.ok(customerService.update(id, request));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Atualizar status")
    public ResponseEntity<CustomerResponse> updateStatus(@PathVariable Long id, @RequestParam Customer.Status status) {
        CustomerRequest req = new CustomerRequest();
        req.setStatus(status);
        return ResponseEntity.ok(customerService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover cliente (soft delete)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        customerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}