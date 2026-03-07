package com.taskflow.service;

import com.taskflow.dto.ProductRequest;
import com.taskflow.dto.ProductResponse;
import com.taskflow.model.Product;
import com.taskflow.model.User;
import com.taskflow.repository.ProductCategoryRepository;
import com.taskflow.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;
    private final UserService userService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return (User) userService.loadUserByUsername(email);
    }

    public Page<ProductResponse> list(String search, Product.Status status, Long categoryId, Pageable pageable) {
        return productRepository.findByUserFiltered(getCurrentUser().getId(), search,
        status != null ? status.name() : null, categoryId, pageable)
                .map(ProductResponse::fromEntity);
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = new Product();
        mapToEntity(product, request);
        product.setUser(getCurrentUser());
        return ProductResponse.fromEntity(productRepository.save(product));
    }

    public ProductResponse findById(Long id) {
        return ProductResponse.fromEntity(findOwned(id));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findOwned(id);
        mapToEntity(product, request);
        return ProductResponse.fromEntity(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        Product product = findOwned(id);
        product.setDeletedAt(LocalDateTime.now());
        productRepository.save(product);
    }

    @Transactional
    public ProductResponse adjustStock(Long id, int delta) {
        Product product = findOwned(id);
        int newStock = product.getStock() + delta;
        if (newStock < 0) throw new RuntimeException("Estoque insuficiente");
        product.setStock(newStock);
        return ProductResponse.fromEntity(productRepository.save(product));
    }

    public List<ProductResponse> getLowStock(int threshold) {
        return productRepository
                .findAllByUserIdAndDeletedAtIsNullAndStockLessThanEqual(getCurrentUser().getId(), threshold)
                .stream().map(ProductResponse::fromEntity).toList();
    }

    private Product findOwned(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        if (product.getDeletedAt() != null) throw new RuntimeException("Produto não encontrado");
        if (!product.getUser().getId().equals(getCurrentUser().getId()))
            throw new RuntimeException("Acesso negado");
        return product;
    }

    private void mapToEntity(Product p, ProductRequest r) {
        p.setName(r.getName());
        p.setDescription(r.getDescription());
        p.setPrice(r.getPrice());
        p.setCostPrice(r.getCostPrice());
        p.setSku(r.getSku());
        if (r.getStock() != null) p.setStock(r.getStock());
        if (r.getUnit() != null) p.setUnit(r.getUnit());
        if (r.getStatus() != null) p.setStatus(r.getStatus());
        p.setImageUrl(r.getImageUrl());
        if (r.getCategoryId() != null) {
            categoryRepository.findById(r.getCategoryId()).ifPresent(p::setCategory);
        }
    }
}