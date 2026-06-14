package com.retailflow.repository;

import com.retailflow.model.Deal;
import org.springframework.data.domain.Pageable;
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

    @Query("SELECT d FROM Deal d WHERE d.deletedAt IS NULL ORDER BY d.createdAt DESC")
    List<Deal> findActiveForKanban();

    @Query("SELECT COUNT(d) FROM Deal d WHERE d.deletedAt IS NULL AND d.stage NOT IN ('WON','LOST')")
    long countActiveDeals();

    @Query("SELECT COALESCE(SUM(d.value),0) FROM Deal d WHERE d.deletedAt IS NULL AND d.stage NOT IN ('WON','LOST')")
    BigDecimal sumPipelineValue();

    @Query("SELECT COUNT(d) FROM Deal d WHERE d.stage = 'WON' AND d.closedAt >= :start")
    long countWonSince(@Param("start") LocalDateTime start);

    @Query("SELECT COALESCE(SUM(d.value),0) FROM Deal d WHERE d.stage = 'WON' AND d.closedAt >= :start AND d.closedAt < :end")
    BigDecimal sumWonRevenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(d) FROM Deal d WHERE d.stage = :stage")
    long countByStage(@Param("stage") Deal.Stage stage);

    @Query("SELECT d.stage, COUNT(d), COALESCE(SUM(d.value),0) FROM Deal d WHERE d.deletedAt IS NULL GROUP BY d.stage")
    List<Object[]> findStageMetrics();

    @Query("SELECT p.id, p.name, COUNT(d) FROM Deal d JOIN d.products p WHERE d.stage = 'WON' AND d.deletedAt IS NULL GROUP BY p.id, p.name ORDER BY COUNT(d) DESC")
    List<Object[]> findTopProducts(Pageable pageable);
}
