package com.taskflow.repository;

import com.taskflow.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("""
        SELECT p FROM Product p WHERE p.user.id = :userId AND p.deletedAt IS NULL
        AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%',:search,'%')))
        AND (:status IS NULL OR p.status = :status)
        AND (:categoryId IS NULL OR p.category.id = :categoryId)
        """)
    Page<Product> findByUserFiltered(
            @Param("userId") Long userId,
            @Param("search") String search,
            @Param("status") Product.Status status,
            @Param("categoryId") Long categoryId,
            Pageable pageable);

    List<Product> findAllByUserIdAndDeletedAtIsNullAndStockLessThanEqual(Long userId, int threshold);
}