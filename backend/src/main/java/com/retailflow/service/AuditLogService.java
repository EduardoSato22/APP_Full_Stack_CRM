package com.retailflow.service;

import com.retailflow.dto.AuditLogResponse;
import com.retailflow.model.AuditLog;
import com.retailflow.model.User;
import com.retailflow.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(User user, AuditLog.EntityType entityType, Long entityId,
                    AuditLog.Action action, String ipAddress) {
        AuditLog log = new AuditLog();
        log.setChangedBy(user);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setAction(action);
        log.setIpAddress(ipAddress);
        auditLogRepository.save(log);
    }

    public Page<AuditLogResponse> list(Long userId, AuditLog.EntityType entityType,
                                       AuditLog.Action action, Pageable pageable) {
        return auditLogRepository.findFiltered(entityType, null, userId, pageable)
                .map(AuditLogResponse::fromEntity);
    }

    public List<AuditLogResponse> findByUser(Long userId) {
        return auditLogRepository.findByChangedByIdOrderByChangedAtDesc(userId)
                .stream().map(AuditLogResponse::fromEntity).toList();
    }
}
