package com.retailflow.repository;

import com.retailflow.model.Customer;
import com.retailflow.model.Role;
import com.retailflow.model.User;
import com.retailflow.specification.CustomerSpec;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.TestPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Requer Docker Desktop em execução.
 * Testa CustomerRepository contra PostgreSQL real via Testcontainers.
 */
@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(properties = {
        "spring.flyway.enabled=false",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class CustomerRepositoryIT {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

    @Autowired CustomerRepository customerRepository;
    @Autowired UserRepository userRepository;

    private User user;
    private Customer customer;

    @BeforeEach
    void setUp() {
        customerRepository.deleteAll();
        userRepository.deleteAll();

        user = new User();
        user.setName("Eduardo");
        user.setEmail("edu@test.com");
        user.setPassword("hashed");
        user.setRole(Role.ADMIN);
        user.setActive(true);
        user = userRepository.save(user);

        customer = new Customer();
        customer.setFirstName("João");
        customer.setLastName("Silva");
        customer.setEmail("joao@test.com");
        customer.setUser(user);
        customer = customerRepository.save(customer);
    }

    @Test
    void findById_returnsCustomer() {
        Optional<Customer> found = customerRepository.findById(customer.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("joao@test.com");
    }

    @Test
    void existsByEmailAndUserIdAndDeletedAtIsNull_returnsTrueForExisting() {
        boolean exists = customerRepository.existsByEmailAndUserIdAndDeletedAtIsNull(
                "joao@test.com", user.getId());
        assertThat(exists).isTrue();
    }

    @Test
    void existsByEmailAndUserIdAndDeletedAtIsNull_returnsFalseForDeleted() {
        customer.setDeletedAt(LocalDateTime.now());
        customerRepository.save(customer);

        boolean exists = customerRepository.existsByEmailAndUserIdAndDeletedAtIsNull(
                "joao@test.com", user.getId());
        assertThat(exists).isFalse();
    }

    @Test
    void countByDeletedAtIsNull_excludesDeleted() {
        customer.setDeletedAt(LocalDateTime.now());
        customerRepository.save(customer);

        long count = customerRepository.countByDeletedAtIsNull();
        assertThat(count).isZero();
    }

    @Test
    void findAll_withSearchSpec_returnsMatchingCustomers() {
        Specification<Customer> spec = CustomerSpec.hasSearch("joão");
        var page = customerRepository.findAll(spec, org.springframework.data.domain.Pageable.unpaged());
        assertThat(page.getContent()).hasSize(1);
        assertThat(page.getContent().get(0).getFirstName()).isEqualTo("João");
    }

    @Test
    void findAll_withSearchSpec_returnsEmptyForNoMatch() {
        Specification<Customer> spec = CustomerSpec.hasSearch("zzznomatch");
        var page = customerRepository.findAll(spec, org.springframework.data.domain.Pageable.unpaged());
        assertThat(page.getContent()).isEmpty();
    }

    @Test
    void findAll_softDeletedCustomers_areExcluded() {
        customer.setDeletedAt(LocalDateTime.now());
        customerRepository.save(customer);

        var all = customerRepository.findAll();
        assertThat(all).isEmpty();
    }
}
