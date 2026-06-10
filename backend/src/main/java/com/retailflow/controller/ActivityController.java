package com.retailflow.controller;

import com.retailflow.dto.ActivityRequest;
import com.retailflow.dto.ActivityResponse;
import com.retailflow.model.Activity;
import com.retailflow.service.ActivityService;
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
@RequestMapping("/api/activities")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Atividades")
public class ActivityController {

    private final ActivityService activityService;

    @GetMapping
    @Operation(summary = "Listar atividades")
    public ResponseEntity<Page<ActivityResponse>> list(
            @RequestParam(required = false) Activity.Status status,
            @RequestParam(required = false) Activity.Type type,
            @RequestParam(required = false) Long assignedTo,
            @RequestParam(required = false) Long customerId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(activityService.list(status, type, assignedTo, customerId, pageable));
    }

    @GetMapping("/overdue")
    @Operation(summary = "Atividades vencidas")
    public ResponseEntity<List<ActivityResponse>> overdue() {
        return ResponseEntity.ok(activityService.getOverdue());
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Próximas atividades")
    public ResponseEntity<List<ActivityResponse>> upcoming(@RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(activityService.getUpcoming(days));
    }

    @PostMapping
    @Operation(summary = "Criar atividade")
    public ResponseEntity<ActivityResponse> create(@Valid @RequestBody ActivityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(activityService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar atividade")
    public ResponseEntity<ActivityResponse> update(@PathVariable Long id, @Valid @RequestBody ActivityRequest request) {
        return ResponseEntity.ok(activityService.update(id, request));
    }

    @PutMapping("/{id}/complete")
    @Operation(summary = "Concluir atividade")
    public ResponseEntity<ActivityResponse> complete(@PathVariable Long id) {
        return ResponseEntity.ok(activityService.complete(id));
    }
}