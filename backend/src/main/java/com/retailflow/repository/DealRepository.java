package com.retailflow.repository;

import com.retailflow.model.Deal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DealRepository extends JpaRepository<Deal, Long> {
    @Query("""
        SELECT d FROM Deal d WHERE d.deletedAt IS NULL
        AND (CAST(:stage AS string) IS NULL OR CAST(d.stage AS string) = :stage)
        AND (:assignedToId IS NULL OR d.assignedTo.id = :assignedToId)
        AND (d.createdBy.id = :userId OR d.assignedTo.id = :userId)
        """)
    Page<Deal> findFiltered(
            @Param("userId") Long userId,
            @Param("stage") String stage,
            @Param("assignedToId") Long assignedToId,
            Pageable pageable);

    List<Deal> findByDeletedAtIsNullAndStageNot(Deal.Stage stage);

    @Query("SELECT COUNT(d) FROM Deal d WHERE d.deletedAt IS NULL AND d.stage NOT IN ('WON','LOST')")
    long countActiveDeals();

    @Query("SELECT COALESCE(SUM(d.value),0) FROM Deal d WHERE d.deletedAt IS NULL AND d.stage NOT IN ('WON','LOST')")
    BigDecimal sumPipelineValue();

    @Query("SELECT COUNT(d) FROM Deal d WHERE d.stage = 'WON' AND d.closedAt >= :start")
    long countWonSince(@Param("start") LocalDateTime start);

    @Query("SELECT COALESCE(SUM(d.value),0) FROM Deal d WHERE d.stage = 'WON' AND d.closedAt >= :start")
    BigDecimal sumWonRevenueSince(@Param("start") LocalDateTime start);
}