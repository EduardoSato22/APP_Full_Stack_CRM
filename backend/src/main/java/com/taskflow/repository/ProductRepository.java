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
    @Query(value = """
        SELECT * FROM products p WHERE p.user_id = :userId AND p.deleted_at IS NULL
        AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')))
        AND (CAST(:status AS text) IS NULL OR p.status = :status)
        AND (:categoryId IS NULL OR p.category_id = :categoryId)
        """,
        countQuery = """
        SELECT COUNT(*) FROM products p WHERE p.user_id = :userId AND p.deleted_at IS NULL
        AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')))
        AND (CAST(:status AS text) IS NULL OR p.status = :status)
        AND (:categoryId IS NULL OR p.category_id = :categoryId)
        """,
        nativeQuery = true)
    Page<Product> findByUserFiltered(
            @Param("userId") Long userId,
            @Param("search") String search,
            @Param("status") String status,
            @Param("categoryId") Long categoryId,
            Pageable pageable);

    List<Product> findAllByUserIdAndDeletedAtIsNullAndStockLessThanEqual(Long userId, int threshold);
}