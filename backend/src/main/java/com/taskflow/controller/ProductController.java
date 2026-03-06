package com.taskflow.controller;

import com.taskflow.dto.ProductRequest;
import com.taskflow.dto.ProductResponse;
import com.taskflow.model.Product;
import com.taskflow.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Produtos")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Listar produtos")
    public ResponseEntity<Page<ProductResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Product.Status status,
            @RequestParam(required = false) Long categoryId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(productService.list(search, status, categoryId, pageable));
    }

    @PostMapping
    @Operation(summary = "Criar produto")
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar produto")
    public ResponseEntity<ProductResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar produto")
    public ResponseEntity<ProductResponse> update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    @PutMapping("/{id}/stock")
    @Operation(summary = "Ajustar estoque")
    public ResponseEntity<ProductResponse> adjustStock(@PathVariable Long id, @RequestParam int delta) {
        return ResponseEntity.ok(productService.adjustStock(id, delta));
    }

    @GetMapping("/low-stock")
    @Operation(summary = "Produtos com baixo estoque")
    public ResponseEntity<List<ProductResponse>> lowStock(@RequestParam(defaultValue = "10") int threshold) {
        return ResponseEntity.ok(productService.getLowStock(threshold));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover produto (soft delete)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}