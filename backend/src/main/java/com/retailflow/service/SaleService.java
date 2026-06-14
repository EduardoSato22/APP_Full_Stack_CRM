package com.retailflow.service;

import com.retailflow.dto.SaleItemRequest;
import com.retailflow.dto.SaleRequest;
import com.retailflow.dto.SaleResponse;
import com.retailflow.exception.ResourceNotFoundException;
import com.retailflow.model.*;
import com.retailflow.repository.CustomerRepository;
import com.retailflow.repository.ProductRepository;
import com.retailflow.repository.SaleRepository;
import com.retailflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public String currentUserName() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @Transactional(readOnly = true)
    public Page<SaleResponse> list(Sale.Status status, Long customerId, Pageable pageable) {
        Specification<Sale> spec = Specification.where(null);
        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }
        if (customerId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("customer").get("id"), customerId));
        }
        return saleRepository.findAll(spec, pageable).map(SaleResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public SaleResponse getById(Long id) {
        return SaleResponse.fromEntity(findOrThrow(id));
    }

    @Transactional
    @CacheEvict(value = "dashboard-summary", key = "#root.target.currentUserName()")
    public SaleResponse create(SaleRequest request, User currentUser) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        Sale sale = new Sale();
        sale.setCustomer(customer);
        sale.setCreatedBy(currentUser);
        sale.setSaleDate(request.getSaleDate() != null ? request.getSaleDate() : LocalDateTime.now());
        sale.setNotes(request.getNotes());

        BigDecimal total = BigDecimal.ZERO;
        for (SaleItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto " + itemReq.getProductId() + " não encontrado"));

            SaleItem item = new SaleItem();
            item.setSale(sale);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPrice(product.getPrice());
            item.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())));
            sale.getItems().add(item);
            total = total.add(item.getSubtotal());
        }
        sale.setTotal(total);

        return SaleResponse.fromEntity(saleRepository.save(sale));
    }

    @Transactional
    @CacheEvict(value = "dashboard-summary", key = "#root.target.currentUserName()")
    public SaleResponse updateStatus(Long id, Sale.Status newStatus) {
        Sale sale = findOrThrow(id);
        sale.setStatus(newStatus);
        return SaleResponse.fromEntity(saleRepository.save(sale));
    }

    @Transactional
    @CacheEvict(value = "dashboard-summary", key = "#root.target.currentUserName()")
    public void delete(Long id) {
        findOrThrow(id);
        saleRepository.deleteById(id);
    }

    private Sale findOrThrow(Long id) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venda não encontrada"));
        User current = userRepository.findByEmail(currentUserName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        if (current.getRole() == Role.USER &&
                (sale.getCreatedBy() == null || !sale.getCreatedBy().getId().equals(current.getId()))) {
            throw new ResourceNotFoundException("Venda não encontrada");
        }
        return sale;
    }
}
