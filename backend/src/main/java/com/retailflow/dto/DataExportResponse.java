package com.retailflow.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class DataExportResponse {
    private UserProfile profile;
    private List<AuditLogResponse> auditLogs;
    private LocalDateTime exportedAt;

    @Data
    @Builder
    public static class UserProfile {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String phone;
        private LocalDateTime createdAt;
        private LocalDateTime lastLoginAt;
    }
}
