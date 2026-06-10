package com.retailflow.service;

import com.retailflow.dto.DealRequest;
import com.retailflow.dto.DealResponse;
import com.retailflow.mapper.DealMapper;
import com.retailflow.model.Customer;
import com.retailflow.model.Deal;
import com.retailflow.model.User;
import com.retailflow.repository.CustomerRepository;
import com.retailflow.repository.DealRepository;
import com.retailflow.repository.ProductRepository;
import com.retailflow.repository.UserRepository;
import com.retailflow.specification.DealSpec;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
    private final DealMapper dealMapper;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return (User) userService.loadUserByUsername(email);
    }

    public Page<DealResponse> list(Deal.Stage stage, Long assignedToId, Pageable pageable) {
        Specification<Deal> spec = DealSpec.isVisibleToUser(getCurrentUser().getId())
                .and(DealSpec.hasStage(stage))
                .and(DealSpec.hasAssignedTo(assignedToId));
        return dealRepository.findAll(spec, pageable).map(dealMapper::toResponse);
    }

    public Map<String, List<DealResponse>> kanban() {
        return dealRepository.findByDeletedAtIsNullAndStageNot(null)
                .stream()
                .map(dealMapper::toResponse)
                .collect(Collectors.groupingBy(d -> d.getStage().name()));
    }

    @Transactional
    public DealResponse create(DealRequest request) {
        User user = getCurrentUser();
        Deal deal = new Deal();
        dealMapper.updateEntity(request, deal);
        resolveRelationships(request, deal);
        deal.setCreatedBy(user);
        return dealMapper.toResponse(dealRepository.save(deal));
    }

    public DealResponse findById(Long id) {
        return dealMapper.toResponse(findOwned(id));
    }

    @Transactional
    public DealResponse update(Long id, DealRequest request) {
        Deal deal = findOwned(id);
        dealMapper.updateEntity(request, deal);
        resolveRelationships(request, deal);
        return dealMapper.toResponse(dealRepository.save(deal));
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
                Customer customer = deal.getCustomer();
                BigDecimal revenue = customer.getTotalRevenue() == null ? BigDecimal.ZERO : customer.getTotalRevenue();
                customer.setTotalRevenue(revenue.add(deal.getValue() == null ? BigDecimal.ZERO : deal.getValue()));
                customerRepository.save(customer);
            }
        }
        if (lostReason != null) deal.setLostReason(lostReason);
        return dealMapper.toResponse(dealRepository.save(deal));
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

    private void resolveRelationships(DealRequest request, Deal deal) {
        if (request.getStage() != null) {
            deal.setProbabilityByStage();
        }
        if (request.getCustomerId() != null) {
            customerRepository.findById(request.getCustomerId()).ifPresent(deal::setCustomer);
        }
        if (request.getAssignedToId() != null) {
            userRepository.findById(request.getAssignedToId()).ifPresent(deal::setAssignedTo);
        }
        if (request.getProductIds() != null) {
            deal.setProducts(productRepository.findAllById(request.getProductIds()));
        }
    }
}
