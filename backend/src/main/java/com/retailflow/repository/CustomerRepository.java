package com.retailflow.repository;

import com.retailflow.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long>, JpaSpecificationExecutor<Customer> {

    boolean existsByEmailAndUserIdAndDeletedAtIsNull(String email, Long userId);

    long countByDeletedAtIsNull();

    @Query("SELECT COUNT(c) FROM Customer c WHERE c.deletedAt IS NULL AND c.createdAt >= :start")
    long countNewSince(@Param("start") LocalDateTime start);
}
