package com.retailflow.repository;

import com.retailflow.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Query("""
        SELECT a FROM AuditLog a WHERE
        (:entityType IS NULL OR a.entityType = :entityType)
        AND (:entityId IS NULL OR a.entityId = :entityId)
        AND (:userId IS NULL OR a.changedBy.id = :userId)
        ORDER BY a.changedAt DESC
        """)
    Page<AuditLog> findFiltered(
            @Param("entityType") AuditLog.EntityType entityType,
            @Param("entityId") Long entityId,
            @Param("userId") Long userId,
            Pageable pageable);
}