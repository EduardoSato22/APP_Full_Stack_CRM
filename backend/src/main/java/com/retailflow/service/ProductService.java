package com.retailflow.service;

import com.retailflow.dto.ProductRequest;
import com.retailflow.dto.ProductResponse;
import com.retailflow.mapper.ProductMapper;
import com.retailflow.model.Product;
import com.retailflow.model.User;
import com.retailflow.repository.ProductCategoryRepository;
import com.retailflow.repository.ProductRepository;
import com.retailflow.specification.ProductSpec;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
    private final ProductMapper productMapper;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return (User) userService.loadUserByUsername(email);
    }

    public Page<ProductResponse> list(String search, Product.Status status, Long categoryId, Pageable pageable) {
        Specification<Product> spec = ProductSpec.hasUserId(getCurrentUser().getId())
                .and(ProductSpec.hasSearch(search))
                .and(ProductSpec.hasStatus(status))
                .and(ProductSpec.hasCategoryId(categoryId));
        return productRepository.findAll(spec, pageable).map(productMapper::toResponse);
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = new Product();
        productMapper.updateEntity(request, product);
        product.setUser(getCurrentUser());
        resolveRelationships(request, product);
        return productMapper.toResponse(productRepository.save(product));
    }

    public ProductResponse findById(Long id) {
        return productMapper.toResponse(findOwned(id));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findOwned(id);
        productMapper.updateEntity(request, product);
        resolveRelationships(request, product);
        return productMapper.toResponse(productRepository.save(product));
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
        return productMapper.toResponse(productRepository.save(product));
    }

    public List<ProductResponse> getLowStock(int threshold) {
        return productRepository
                .findAllByUserIdAndDeletedAtIsNullAndStockLessThanEqual(getCurrentUser().getId(), threshold)
                .stream().map(productMapper::toResponse).toList();
    }

    private Product findOwned(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        if (product.getDeletedAt() != null) throw new RuntimeException("Produto não encontrado");
        if (!product.getUser().getId().equals(getCurrentUser().getId()))
            throw new RuntimeException("Acesso negado");
        return product;
    }

    private void resolveRelationships(ProductRequest request, Product product) {
        if (request.getCategoryId() != null) {
            categoryRepository.findById(request.getCategoryId()).ifPresent(product::setCategory);
        }
    }
}
