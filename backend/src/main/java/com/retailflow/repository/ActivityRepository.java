package com.retailflow.repository;

import com.retailflow.model.Activity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    @Query("""
        SELECT a FROM Activity a WHERE
        (CAST(:status AS string) IS NULL OR CAST(a.status AS string) = :status)
        AND (CAST(:type AS string) IS NULL OR CAST(a.type AS string) = :type)
        AND (:assignedToId IS NULL OR a.assignedTo.id = :assignedToId)
        AND (:customerId IS NULL OR a.customer.id = :customerId)
        """)
    Page<Activity> findFiltered(
            @Param("status") String status,
            @Param("type") String type,
            @Param("assignedToId") Long assignedToId,
            @Param("customerId") Long customerId,
            Pageable pageable);

    @Query("SELECT a FROM Activity a WHERE a.status NOT IN ('DONE','CANCELLED') AND a.dueDate < :now")
    List<Activity> findOverdue(@Param("now") LocalDateTime now);

    @Query("SELECT a FROM Activity a WHERE a.status NOT IN ('DONE','CANCELLED') AND a.dueDate BETWEEN :start AND :end")
    List<Activity> findUpcoming(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(a) FROM Activity a WHERE a.assignedTo.id = :userId AND a.status = 'PENDING' AND a.dueDate BETWEEN :start AND :end")
    long countTodayPending(@Param("userId") Long userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}