package com.taskflow.repository;

import com.taskflow.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    @Query("""
        SELECT c FROM Customer c WHERE c.deletedAt IS NULL
        AND (c.user.id = :userId OR c.assignedTo.id = :userId)
        AND (:search IS NULL OR LOWER(c.firstName) LIKE LOWER(CONCAT('%',:search,'%'))
             OR LOWER(c.lastName) LIKE LOWER(CONCAT('%',:search,'%'))
             OR LOWER(c.email) LIKE LOWER(CONCAT('%',:search,'%'))
             OR LOWER(c.company) LIKE LOWER(CONCAT('%',:search,'%')))
        AND (:status IS NULL OR c.status = :status)
        """)
    Page<Customer> findByUserFiltered(
            @Param("userId") Long userId,
            @Param("search") String search,
            @Param("status") Customer.Status status,
            Pageable pageable);

    @Query("SELECT c FROM Customer c WHERE c.deletedAt IS NULL AND (:search IS NULL OR LOWER(c.firstName) LIKE LOWER(CONCAT('%',:search,'%')) OR LOWER(c.email) LIKE LOWER(CONCAT('%',:search,'%'))) AND (:status IS NULL OR c.status = :status)")
    Page<Customer> findAllFiltered(
            @Param("search") String search,
            @Param("status") Customer.Status status,
            Pageable pageable);

    boolean existsByEmailAndUserIdAndDeletedAtIsNull(String email, Long userId);

    long countByDeletedAtIsNull();

    @Query("SELECT COUNT(c) FROM Customer c WHERE c.deletedAt IS NULL AND c.createdAt >= :start")
    long countNewSince(@Param("start") java.time.LocalDateTime start);
}