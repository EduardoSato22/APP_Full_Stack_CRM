package com.retailflow.controller;

import com.retailflow.dto.AuthResponse;
import com.retailflow.dto.DataExportResponse;
import com.retailflow.dto.LoginRequest;
import com.retailflow.dto.RefreshTokenRequest;
import com.retailflow.dto.RegisterRequest;
import com.retailflow.model.User;
import com.retailflow.service.AuditLogService;
import com.retailflow.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação")
public class AuthController {

    private final AuthService authService;
    private final AuditLogService auditLogService;

    @PostMapping("/register")
    @Operation(summary = "Registrar usuário")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Renovar access token")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refresh(request.getRefreshToken()));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal User user) {
        authService.logout(user.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    @Operation(summary = "Perfil do usuário autenticado")
    public ResponseEntity<AuthResponse> me(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(authService.buildResponse(user));
    }

    @GetMapping("/me/data-export")
    @Operation(summary = "LGPD — exportar todos os dados do usuário")
    public ResponseEntity<DataExportResponse> dataExport(@AuthenticationPrincipal User user) {
        DataExportResponse export = DataExportResponse.builder()
                .profile(DataExportResponse.UserProfile.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .phone(user.getPhone())
                        .createdAt(user.getCreatedAt())
                        .lastLoginAt(user.getLastLoginAt())
                        .build())
                .auditLogs(auditLogService.findByUser(user.getId()))
                .exportedAt(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(export);
    }

    @DeleteMapping("/me")
    @Operation(summary = "LGPD — anonimizar e excluir conta")
    public ResponseEntity<Void> deleteAccount(@AuthenticationPrincipal User user) {
        authService.anonymizeAndDelete(user);
        return ResponseEntity.noContent().build();
    }
}