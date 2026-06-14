package com.retailflow.repository;

import com.retailflow.model.Activity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long>, JpaSpecificationExecutor<Activity> {

    @EntityGraph(attributePaths = {"customer", "assignedTo", "createdBy", "deal"})
    @Override
    Page<Activity> findAll(Specification<Activity> spec, Pageable pageable);

    @Query("SELECT a FROM Activity a LEFT JOIN FETCH a.customer LEFT JOIN FETCH a.assignedTo LEFT JOIN FETCH a.createdBy WHERE a.status NOT IN ('DONE','CANCELLED') AND a.dueDate < :now")
    List<Activity> findOverdue(@Param("now") LocalDateTime now);

    @Query("SELECT a FROM Activity a LEFT JOIN FETCH a.customer LEFT JOIN FETCH a.assignedTo LEFT JOIN FETCH a.createdBy WHERE a.status NOT IN ('DONE','CANCELLED') AND a.dueDate BETWEEN :start AND :end")
    List<Activity> findUpcoming(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(a) FROM Activity a WHERE a.assignedTo.id = :userId AND a.status = 'PENDING' AND a.dueDate BETWEEN :start AND :end")
    long countTodayPending(@Param("userId") Long userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
