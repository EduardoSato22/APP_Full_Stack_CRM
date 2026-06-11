package com.retailflow.service;

import com.retailflow.dto.CustomerRequest;
import com.retailflow.dto.CustomerResponse;
import com.retailflow.mapper.CustomerMapper;
import com.retailflow.model.Customer;
import com.retailflow.model.Role;
import com.retailflow.model.User;
import com.retailflow.repository.CustomerRepository;
import com.retailflow.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class CustomerServiceTest {

    @Mock CustomerRepository customerRepository;
    @Mock UserRepository userRepository;
    @Mock UserService userService;
    @Mock CustomerMapper customerMapper;

    @InjectMocks CustomerService customerService;

    private User adminUser;
    private User regularUser;
    private Customer customer;
    private CustomerResponse customerResponse;

    @BeforeEach
    void setUp() {
        adminUser = new User();
        adminUser.setId(1L);
        adminUser.setEmail("admin@test.com");
        adminUser.setRole(Role.ADMIN);

        regularUser = new User();
        regularUser.setId(2L);
        regularUser.setEmail("user@test.com");
        regularUser.setRole(Role.USER);

        customer = new Customer();
        customer.setId(10L);
        customer.setFirstName("João");
        customer.setLastName("Silva");
        customer.setEmail("joao@test.com");
        customer.setUser(adminUser);

        customerResponse = new CustomerResponse();
        customerResponse.setId(10L);
        customerResponse.setFullName("João Silva");

        mockSecurityContext(adminUser);
    }

    private void mockSecurityContext(User user) {
        Authentication auth = mock(Authentication.class);
        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(auth);
        when(auth.getName()).thenReturn(user.getEmail());
        SecurityContextHolder.setContext(ctx);
        when(userService.loadUserByUsername(user.getEmail())).thenReturn(user);
    }

    @Test
    void list_adminReceivesAllCustomers() {
        Page<Customer> page = new PageImpl<>(List.of(customer));
        when(customerRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);
        when(customerMapper.toResponse(customer)).thenReturn(customerResponse);

        Page<CustomerResponse> result = customerService.list(null, null, PageRequest.of(0, 20));

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getId()).isEqualTo(10L);
        verify(customerRepository).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void create_savesAndReturnsResponse() {
        CustomerRequest request = new CustomerRequest();
        request.setFirstName("João");
        request.setLastName("Silva");
        request.setEmail("joao@test.com");

        when(customerRepository.existsByEmailAndUserIdAndDeletedAtIsNull(anyString(), anyLong())).thenReturn(false);
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);
        when(customerMapper.toResponse(customer)).thenReturn(customerResponse);

        CustomerResponse result = customerService.create(request);

        assertThat(result.getId()).isEqualTo(10L);
        verify(customerMapper).updateEntity(eq(request), any(Customer.class));
        verify(customerRepository).save(any(Customer.class));
    }

    @Test
    void create_throwsOnDuplicateEmail() {
        CustomerRequest request = new CustomerRequest();
        request.setEmail("joao@test.com");
        when(customerRepository.existsByEmailAndUserIdAndDeletedAtIsNull(anyString(), anyLong())).thenReturn(true);

        assertThatThrownBy(() -> customerService.create(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("e-mail");
    }

    @Test
    void findById_returnsCustomer() {
        when(customerRepository.findById(10L)).thenReturn(Optional.of(customer));
        when(customerMapper.toResponse(customer)).thenReturn(customerResponse);

        CustomerResponse result = customerService.findById(10L);

        assertThat(result.getId()).isEqualTo(10L);
    }

    @Test
    void findById_throwsWhenNotFound() {
        when(customerRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> customerService.findById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("não encontrado");
    }

    @Test
    void update_updatesAndReturns() {
        CustomerRequest request = new CustomerRequest();
        request.setFirstName("João");
        request.setEmail("joao@test.com");

        when(customerRepository.findById(10L)).thenReturn(Optional.of(customer));
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);
        when(customerMapper.toResponse(customer)).thenReturn(customerResponse);

        CustomerResponse result = customerService.update(10L, request);

        assertThat(result).isNotNull();
        verify(customerMapper).updateEntity(eq(request), eq(customer));
    }

    @Test
    void delete_setsDeletedAt() {
        when(customerRepository.findById(10L)).thenReturn(Optional.of(customer));

        customerService.delete(10L);

        assertThat(customer.getDeletedAt()).isNotNull();
        verify(customerRepository).save(customer);
    }

    @Test
    void findById_regularUser_throwsForOtherUsersCustomer() {
        mockSecurityContext(regularUser);
        customer.setUser(adminUser); // owned by admin, not regularUser

        when(customerRepository.findById(10L)).thenReturn(Optional.of(customer));

        assertThatThrownBy(() -> customerService.findById(10L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Acesso negado");
    }
}
