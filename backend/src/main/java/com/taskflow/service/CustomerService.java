package com.taskflow.service;

import com.taskflow.dto.CustomerRequest;
import com.taskflow.dto.CustomerResponse;
import com.taskflow.model.Customer;
import com.taskflow.model.Role;
import com.taskflow.model.User;
import com.taskflow.repository.CustomerRepository;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return (User) userService.loadUserByUsername(email);
    }

    public Page<CustomerResponse> list(String search, Customer.Status status, Pageable pageable) {
        User user = getCurrentUser();
        String statusStr = status != null ? status.name() : null;
        Page<Customer> page;
        if (user.getRole() == Role.ADMIN || user.getRole() == Role.MANAGER) {
            page = customerRepository.findAllFiltered(search, statusStr, pageable);
        } else {
            page = customerRepository.findByUserFiltered(user.getId(), search, statusStr, pageable);
        }
        return page.map(CustomerResponse::fromEntity);
    }

    @Transactional
    public CustomerResponse create(CustomerRequest request) {
        User user = getCurrentUser();
        if (customerRepository.existsByEmailAndUserIdAndDeletedAtIsNull(request.getEmail(), user.getId())) {
            throw new RuntimeException("Já existe um cliente com este e-mail");
        }
        Customer customer = new Customer();
        mapToEntity(customer, request);
        customer.setUser(user);
        return CustomerResponse.fromEntity(customerRepository.save(customer));
    }

    public CustomerResponse findById(Long id) {
        return CustomerResponse.fromEntity(findOwned(id));
    }

    @Transactional
    public CustomerResponse update(Long id, CustomerRequest request) {
        Customer customer = findOwned(id);
        User user = getCurrentUser();
        if (!customer.getEmail().equalsIgnoreCase(request.getEmail()) &&
                customerRepository.existsByEmailAndUserIdAndDeletedAtIsNull(request.getEmail(), user.getId())) {
            throw new RuntimeException("Já existe um cliente com este e-mail");
        }
        mapToEntity(customer, request);
        return CustomerResponse.fromEntity(customerRepository.save(customer));
    }

    @Transactional
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

    private void mapToEntity(Customer c, CustomerRequest r) {
        c.setFirstName(r.getFirstName());
        c.setLastName(r.getLastName());
        c.setEmail(r.getEmail());
        c.setAge(r.getAge());
        c.setPhone(r.getPhone());
        c.setCompany(r.getCompany());
        c.setPosition(r.getPosition());
        c.setPhotoUrl(r.getPhotoUrl());
        c.setStreet(r.getStreet());
        c.setCity(r.getCity());
        c.setState(r.getState());
        c.setZipCode(r.getZipCode());
        c.setCountry(r.getCountry());
        c.setNotes(r.getNotes());
        c.setNextFollowUpDate(r.getNextFollowUpDate());
        if (r.getStatus() != null) c.setStatus(r.getStatus());
        if (r.getSource() != null) c.setSource(r.getSource());
        if (r.getTags() != null) c.setTags(r.getTags());
        if (r.getAssignedToId() != null) {
            userRepository.findById(r.getAssignedToId()).ifPresent(c::setAssignedTo);
        }
    }
}