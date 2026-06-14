package com.retailflow.repository;

import com.retailflow.model.Sale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long>, JpaSpecificationExecutor<Sale> {

    @EntityGraph(attributePaths = {"customer", "createdBy"})
    @Override
    Page<Sale> findAll(Specification<Sale> spec, Pageable pageable);

    @Query("SELECT COALESCE(SUM(s.total), 0) FROM Sale s WHERE s.status IN ('CONFIRMED','DELIVERED','SHIPPED') AND s.saleDate BETWEEN :from AND :to")
    BigDecimal sumRevenueBetween(LocalDateTime from, LocalDateTime to);
}
