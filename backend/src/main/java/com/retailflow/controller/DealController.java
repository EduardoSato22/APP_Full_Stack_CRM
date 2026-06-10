package com.retailflow.controller;

import com.retailflow.dto.DealRequest;
import com.retailflow.dto.DealResponse;
import com.retailflow.model.Deal;
import com.retailflow.service.DealService;
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
import java.util.Map;

@RestController
@RequestMapping("/api/deals")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Negociações")
public class DealController {

    private final DealService dealService;

    @GetMapping
    @Operation(summary = "Listar negociações")
    public ResponseEntity<Page<DealResponse>> list(
            @RequestParam(required = false) Deal.Stage stage,
            @RequestParam(required = false) Long assignedTo,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(dealService.list(stage, assignedTo, pageable));
    }

    @GetMapping("/kanban")
    @Operation(summary = "Kanban por estágio")
    public ResponseEntity<Map<String, List<DealResponse>>> kanban() {
        return ResponseEntity.ok(dealService.kanban());
    }

    @PostMapping
    @Operation(summary = "Criar negociação")
    public ResponseEntity<DealResponse> create(@Valid @RequestBody DealRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(dealService.create(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar negociação")
    public ResponseEntity<DealResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(dealService.findById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar negociação")
    public ResponseEntity<DealResponse> update(@PathVariable Long id, @Valid @RequestBody DealRequest request) {
        return ResponseEntity.ok(dealService.update(id, request));
    }

    @PutMapping("/{id}/stage")
    @Operation(summary = "Mover estágio")
    public ResponseEntity<DealResponse> changeStage(
            @PathVariable Long id,
            @RequestParam Deal.Stage stage,
            @RequestParam(required = false) String lostReason) {
        return ResponseEntity.ok(dealService.changeStage(id, stage, lostReason));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover negociação")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        dealService.delete(id);
        return ResponseEntity.noContent().build();
    }
}