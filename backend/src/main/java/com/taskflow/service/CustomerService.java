package com.taskflow.service;

import com.taskflow.dto.CustomerRequest;
import com.taskflow.dto.CustomerResponse;
import com.taskflow.model.Customer;
import com.taskflow.model.User;
import com.taskflow.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final UserService userService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return (User) userService.loadUserByUsername(email);
    }

    public CustomerResponse create(CustomerRequest request) {
        User user = getCurrentUser();
        if (customerRepository.existsByEmailAndUserId(request.getEmail(), user.getId())) {
            throw new RuntimeException("Já existe um cliente com este e-mail");
        }

        Customer customer = new Customer();
        mapToEntity(customer, request);
        customer.setUser(user);

        return CustomerResponse.fromEntity(customerRepository.save(customer));
    }

    public List<CustomerResponse> list() {
        User user = getCurrentUser();
        return customerRepository.findAllByUserIdOrderByFirstNameAsc(user.getId())
                .stream()
                .map(CustomerResponse::fromEntity)
                .toList();
    }

    public CustomerResponse findById(Long id) {
        Customer customer = findOwnedCustomer(id);
        return CustomerResponse.fromEntity(customer);
    }

    public CustomerResponse update(Long id, CustomerRequest request) {
        Customer customer = findOwnedCustomer(id);
        if (!customer.getEmail().equalsIgnoreCase(request.getEmail())) {
            User user = getCurrentUser();
            if (customerRepository.existsByEmailAndUserId(request.getEmail(), user.getId())) {
                throw new RuntimeException("Já existe um cliente com este e-mail");
            }
        }

        mapToEntity(customer, request);
        return CustomerResponse.fromEntity(customerRepository.save(customer));
    }

    public void delete(Long id) {
        Customer customer = findOwnedCustomer(id);
        customerRepository.delete(customer);
    }

    private Customer findOwnedCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        User user = getCurrentUser();
        if (!customer.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Acesso negado");
        }
        return customer;
    }

    private void mapToEntity(Customer customer, CustomerRequest request) {
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setEmail(request.getEmail());
        customer.setAge(request.getAge());
        customer.setPhotoUrl(request.getPhotoUrl());
    }
}

