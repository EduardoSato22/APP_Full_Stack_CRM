package com.retailflow.controller;

import com.retailflow.dto.SaleRequest;
import com.retailflow.dto.SaleResponse;
import com.retailflow.model.Sale;
import com.retailflow.model.User;
import com.retailflow.service.SaleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
@Tag(name = "Vendas")
public class SaleController {

    private final SaleService saleService;

    @GetMapping
    @Operation(summary = "Listar vendas")
    public ResponseEntity<Page<SaleResponse>> list(
            @RequestParam(required = false) Sale.Status status,
            @RequestParam(required = false) Long customerId,
            @PageableDefault(size = 20, sort = "saleDate") Pageable pageable) {
        return ResponseEntity.ok(saleService.list(status, customerId, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar venda por ID")
    public ResponseEntity<SaleResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(saleService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Registrar nova venda")
    public ResponseEntity<SaleResponse> create(
            @Valid @RequestBody SaleRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.status(201).body(saleService.create(request, currentUser));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Atualizar status da venda")
    public ResponseEntity<SaleResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam Sale.Status status) {
        return ResponseEntity.ok(saleService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir venda (soft delete)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        saleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
