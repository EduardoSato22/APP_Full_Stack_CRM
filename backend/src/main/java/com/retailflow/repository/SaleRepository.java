package com.retailflow.repository;

import com.retailflow.model.Sale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    Page<Sale> findByCustomerId(Long customerId, Pageable pageable);

    Page<Sale> findByStatus(Sale.Status status, Pageable pageable);

    @Query("SELECT s FROM Sale s WHERE (:status IS NULL OR s.status = :status) AND (:customerId IS NULL OR s.customer.id = :customerId)")
    Page<Sale> findFiltered(Sale.Status status, Long customerId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(s.total), 0) FROM Sale s WHERE s.status IN ('CONFIRMED','DELIVERED','SHIPPED') AND s.saleDate BETWEEN :from AND :to")
    BigDecimal sumRevenueBetween(LocalDateTime from, LocalDateTime to);
}
