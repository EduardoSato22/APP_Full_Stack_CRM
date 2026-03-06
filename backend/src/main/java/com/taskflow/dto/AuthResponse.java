package com.taskflow.dto;

import com.taskflow.model.Role;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AuthResponse {
    private String token;
    private String refreshToken;
    private String type = "Bearer";
    private Long userId;
    private String name;
    private String email;
    private Role role;
    private LocalDateTime expiresAt;

    public AuthResponse(String token, String refreshToken, Long userId, String name, String email, Role role, LocalDateTime expiresAt) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.expiresAt = expiresAt;
    }
}