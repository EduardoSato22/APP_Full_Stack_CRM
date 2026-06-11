package com.retailflow.dto;

import com.retailflow.model.AuditLog;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AuditLogResponse {
    private Long id;
    private AuditLog.EntityType entityType;
    private Long entityId;
    private AuditLog.Action action;
    private String changedByName;
    private LocalDateTime changedAt;
    private String ipAddress;

    public static AuditLogResponse fromEntity(AuditLog log) {
        AuditLogResponse r = new AuditLogResponse();
        r.id = log.getId();
        r.entityType = log.getEntityType();
        r.entityId = log.getEntityId();
        r.action = log.getAction();
        r.changedByName = log.getChangedBy() != null ? log.getChangedBy().getName() : null;
        r.changedAt = log.getChangedAt();
        r.ipAddress = log.getIpAddress();
        return r;
    }
}
