package com.taskflow.service;

import com.taskflow.dto.DealRequest;
import com.taskflow.dto.DealResponse;
import com.taskflow.model.Customer;
import com.taskflow.model.Deal;
import com.taskflow.model.User;
import com.taskflow.repository.CustomerRepository;
import com.taskflow.repository.DealRepository;
import com.taskflow.repository.ProductRepository;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DealService {

    private final DealRepository dealRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return (User) userService.loadUserByUsername(email);
    }

    public Page<DealResponse> list(Deal.Stage stage, Long assignedToId, Pageable pageable) {
        return dealRepository.findFiltered(getCurrentUser().getId(), stage, assignedToId, pageable)
                .map(DealResponse::fromEntity);
    }

    public Map<String, List<DealResponse>> kanban() {
        return dealRepository.findByDeletedAtIsNullAndStageNot(null)
                .stream()
                .map(DealResponse::fromEntity)
                .collect(Collectors.groupingBy(d -> d.getStage().name()));
    }

    @Transactional
    public DealResponse create(DealRequest request) {
        User user = getCurrentUser();
        Deal deal = new Deal();
        mapToEntity(deal, request);
        deal.setCreatedBy(user);
        return DealResponse.fromEntity(dealRepository.save(deal));
    }

    public DealResponse findById(Long id) {
        return DealResponse.fromEntity(findOwned(id));
    }

    @Transactional
    public DealResponse update(Long id, DealRequest request) {
        Deal deal = findOwned(id);
        mapToEntity(deal, request);
        return DealResponse.fromEntity(dealRepository.save(deal));
    }

    @Transactional
    public DealResponse changeStage(Long id, Deal.Stage newStage, String lostReason) {
        Deal deal = findOwned(id);
        if (newStage == Deal.Stage.LOST && (lostReason == null || lostReason.isBlank())) {
            throw new RuntimeException("Motivo de perda é obrigatório");
        }
        deal.setStage(newStage);
        deal.setProbabilityByStage();
        if (newStage == Deal.Stage.WON || newStage == Deal.Stage.LOST) {
            deal.setClosedAt(LocalDateTime.now());
            if (newStage == Deal.Stage.WON) {
                // Update customer totalRevenue
                Customer customer = deal.getCustomer();
                BigDecimal revenue = customer.getTotalRevenue() == null ? BigDecimal.ZERO : customer.getTotalRevenue();
                customer.setTotalRevenue(revenue.add(deal.getValue() == null ? BigDecimal.ZERO : deal.getValue()));
                customerRepository.save(customer);
            }
        }
        if (lostReason != null) deal.setLostReason(lostReason);
        return DealResponse.fromEntity(dealRepository.save(deal));
    }

    @Transactional
    public void delete(Long id) {
        Deal deal = findOwned(id);
        deal.setDeletedAt(LocalDateTime.now());
        dealRepository.save(deal);
    }

    private Deal findOwned(Long id) {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Negociação não encontrada"));
        if (deal.getDeletedAt() != null) throw new RuntimeException("Negociação não encontrada");
        return deal;
    }

    private void mapToEntity(Deal d, DealRequest r) {
        d.setTitle(r.getTitle());
        d.setValue(r.getValue() != null ? r.getValue() : BigDecimal.ZERO);
        if (r.getStage() != null) { d.setStage(r.getStage()); d.setProbabilityByStage(); }
        d.setExpectedCloseDate(r.getExpectedCloseDate());
        d.setNotes(r.getNotes());
        if (r.getCustomerId() != null) {
            customerRepository.findById(r.getCustomerId()).ifPresent(d::setCustomer);
        }
        if (r.getAssignedToId() != null) {
            userRepository.findById(r.getAssignedToId()).ifPresent(d::setAssignedTo);
        }
        if (r.getProductIds() != null) {
            d.setProducts(productRepository.findAllById(r.getProductIds()));
        }
    }
}