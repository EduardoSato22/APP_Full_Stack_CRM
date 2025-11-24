package com.taskflow.repository;

import com.taskflow.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findAllByUserIdOrderByFirstNameAsc(Long userId);
    boolean existsByEmailAndUserId(String email, Long userId);
}

