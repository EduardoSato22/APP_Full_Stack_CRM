package com.retailflow.controller;

import com.retailflow.dto.AuditLogResponse;
import com.retailflow.model.AuditLog;
import com.retailflow.model.Role;
import com.retailflow.model.User;
import com.retailflow.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
@Tag(name = "Audit Log")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    @Operation(summary = "Listar audit logs (admin: todos; user: próprios registros)")
    public ResponseEntity<Page<AuditLogResponse>> list(
            @RequestParam(required = false) AuditLog.EntityType entityType,
            @RequestParam(required = false) AuditLog.Action action,
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal User currentUser) {
        // Admin sees all; regular users see only their own logs
        Long userId = currentUser.getRole() == Role.ADMIN ? null : currentUser.getId();
        return ResponseEntity.ok(auditLogService.list(userId, entityType, action, pageable));
    }
}
