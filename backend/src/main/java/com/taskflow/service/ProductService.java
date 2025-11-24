package com.taskflow.service;

import com.taskflow.dto.ProductRequest;
import com.taskflow.dto.ProductResponse;
import com.taskflow.model.Product;
import com.taskflow.model.User;
import com.taskflow.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserService userService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return (User) userService.loadUserByUsername(email);
    }

    public ProductResponse create(ProductRequest request) {
        User user = getCurrentUser();
        Product product = new Product();
        mapToEntity(product, request);
        product.setUser(user);
        return ProductResponse.fromEntity(productRepository.save(product));
    }

    public List<ProductResponse> list() {
        User user = getCurrentUser();
        return productRepository.findAllByUserIdOrderByLastUpdatedDesc(user.getId())
                .stream()
                .map(ProductResponse::fromEntity)
                .toList();
    }

    public ProductResponse findById(Long id) {
        Product product = findOwnedProduct(id);
        return ProductResponse.fromEntity(product);
    }

    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findOwnedProduct(id);
        mapToEntity(product, request);
        return ProductResponse.fromEntity(productRepository.save(product));
    }

    public void delete(Long id) {
        Product product = findOwnedProduct(id);
        productRepository.delete(product);
    }

    private Product findOwnedProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        User user = getCurrentUser();
        if (!product.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Acesso negado");
        }
        return product;
    }

    private void mapToEntity(Product product, ProductRequest request) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
    }
}

