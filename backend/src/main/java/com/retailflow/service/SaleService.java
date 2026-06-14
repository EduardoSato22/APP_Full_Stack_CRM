package com.retailflow.service;

import com.retailflow.dto.SaleItemRequest;
import com.retailflow.dto.SaleRequest;
import com.retailflow.dto.SaleResponse;
import com.retailflow.model.*;
import com.retailflow.repository.CustomerRepository;
import com.retailflow.repository.ProductRepository;
import com.retailflow.repository.SaleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Transactional(readOnly = true)
    public Page<SaleResponse> list(Sale.Status status, Long customerId, Pageable pageable) {
        return saleRepository.findFiltered(status, customerId, pageable)
                .map(SaleResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public SaleResponse getById(Long id) {
        return SaleResponse.fromEntity(findOrThrow(id));
    }

    @Transactional
    @CacheEvict(value = "dashboard-summary", allEntries = true)
    public SaleResponse create(SaleRequest request, User currentUser) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));

        Sale sale = new Sale();
        sale.setCustomer(customer);
        sale.setCreatedBy(currentUser);
        sale.setSaleDate(request.getSaleDate() != null ? request.getSaleDate() : LocalDateTime.now());
        sale.setNotes(request.getNotes());

        BigDecimal total = BigDecimal.ZERO;
        for (SaleItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException("Produto " + itemReq.getProductId() + " não encontrado"));

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
    @CacheEvict(value = "dashboard-summary", allEntries = true)
    public SaleResponse updateStatus(Long id, Sale.Status newStatus) {
        Sale sale = findOrThrow(id);
        sale.setStatus(newStatus);
        return SaleResponse.fromEntity(saleRepository.save(sale));
    }

    @Transactional
    @CacheEvict(value = "dashboard-summary", allEntries = true)
    public void delete(Long id) {
        findOrThrow(id);
        saleRepository.deleteById(id);
    }

    private Sale findOrThrow(Long id) {
        return saleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Venda não encontrada"));
    }
}
