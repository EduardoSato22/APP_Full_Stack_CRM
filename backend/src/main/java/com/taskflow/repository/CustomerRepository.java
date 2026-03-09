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

    @Query(value = """
        SELECT * FROM customers c WHERE c.deleted_at IS NULL
        AND (c.user_id = :userId OR c.assigned_to = :userId)
        AND (
            :search IS NULL
            OR LOWER(c.first_name) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
            OR LOWER(c.last_name)  LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
            OR LOWER(c.email)      LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
            OR LOWER(c.company)    LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
        )
        AND (CAST(:status AS text) IS NULL OR c.status = :status)
        """, nativeQuery = true)
    Page<Customer> findByUserFiltered(
            @Param("userId") Long userId,
            @Param("search") String search,
            @Param("status") String status,
            Pageable pageable);

    @Query(value = """
        SELECT * FROM customers c WHERE c.deleted_at IS NULL
        AND (
            :search IS NULL
            OR LOWER(c.first_name) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
            OR LOWER(c.email)      LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
        )
        AND (CAST(:status AS text) IS NULL OR c.status = :status)
        """, nativeQuery = true)
    Page<Customer> findAllFiltered(
            @Param("search") String search,
            @Param("status") String status,
            Pageable pageable);

    boolean existsByEmailAndUserIdAndDeletedAtIsNull(String email, Long userId);
    long countByDeletedAtIsNull();

    @Query("SELECT COUNT(c) FROM Customer c WHERE c.deletedAt IS NULL AND c.createdAt >= :start")
    long countNewSince(@Param("start") java.time.LocalDateTime start);
}