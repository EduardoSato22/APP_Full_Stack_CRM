package com.retailflow.repository;

import com.retailflow.model.Deal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DealRepository extends JpaRepository<Deal, Long>, JpaSpecificationExecutor<Deal> {

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
