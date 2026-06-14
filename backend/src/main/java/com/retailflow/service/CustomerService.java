package com.retailflow.service;

import com.retailflow.dto.CustomerRequest;
import com.retailflow.dto.CustomerResponse;
import com.retailflow.mapper.CustomerMapper;
import com.retailflow.model.Customer;
import com.retailflow.model.Role;
import com.retailflow.model.User;
import com.retailflow.repository.CustomerRepository;
import com.retailflow.repository.UserRepository;
import com.retailflow.specification.CustomerSpec;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final CustomerMapper customerMapper;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return (User) userService.loadUserByUsername(email);
    }

    @Transactional(readOnly = true)
    public Page<CustomerResponse> list(String search, Customer.Status status, Pageable pageable) {
        User user = getCurrentUser();
        Specification<Customer> spec = CustomerSpec.hasSearch(search)
                .and(CustomerSpec.hasStatus(status));
        if (user.getRole() != Role.ADMIN && user.getRole() != Role.MANAGER) {
            spec = spec.and(CustomerSpec.isVisibleToUser(user.getId()));
        }
        Sort sort = pageable.getSort().isSorted() ? pageable.getSort() : Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable sorted = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        return customerRepository.findAll(spec, sorted).map(customerMapper::toResponse);
    }

    @Transactional
    @CacheEvict(value = "dashboard-summary", allEntries = true)
    public CustomerResponse create(CustomerRequest request) {
        User user = getCurrentUser();
        if (customerRepository.existsByEmailAndUserIdAndDeletedAtIsNull(request.getEmail(), user.getId())) {
            throw new RuntimeException("Já existe um cliente com este e-mail");
        }
        Customer customer = new Customer();
        customerMapper.updateEntity(request, customer);
        customer.setUser(user);
        resolveRelationships(request, customer);
        return customerMapper.toResponse(customerRepository.save(customer));
    }

    @Transactional(readOnly = true)
    public CustomerResponse findById(Long id) {
        return customerMapper.toResponse(findOwned(id));
    }

    @Transactional
    @CacheEvict(value = "dashboard-summary", allEntries = true)
    public CustomerResponse update(Long id, CustomerRequest request) {
        Customer customer = findOwned(id);
        User user = getCurrentUser();
        if (!customer.getEmail().equalsIgnoreCase(request.getEmail()) &&
                customerRepository.existsByEmailAndUserIdAndDeletedAtIsNull(request.getEmail(), user.getId())) {
            throw new RuntimeException("Já existe um cliente com este e-mail");
        }
        customerMapper.updateEntity(request, customer);
        resolveRelationships(request, customer);
        return customerMapper.toResponse(customerRepository.save(customer));
    }

    @Transactional
    @CacheEvict(value = "dashboard-summary", allEntries = true)
    public void delete(Long id) {
        Customer customer = findOwned(id);
        customer.setDeletedAt(LocalDateTime.now());
        customerRepository.save(customer);
    }

    private Customer findOwned(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        if (customer.getDeletedAt() != null) throw new RuntimeException("Cliente não encontrado");
        User user = getCurrentUser();
        if (user.getRole() == Role.USER && !customer.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Acesso negado");
        }
        return customer;
    }

    private void resolveRelationships(CustomerRequest request, Customer customer) {
        if (request.getAssignedToId() != null) {
            userRepository.findById(request.getAssignedToId()).ifPresent(customer::setAssignedTo);
        }
    }
}
