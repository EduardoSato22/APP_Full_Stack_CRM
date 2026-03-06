package com.taskflow.service;

import com.taskflow.dto.UserResponse;
import com.taskflow.model.Role;
import com.taskflow.model.User;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public List<UserResponse> listAll() {
        return userRepository.findAll().stream()
                .filter(u -> u.getDeletedAt() == null)
                .map(UserResponse::fromEntity).toList();
    }

    @Transactional
    public UserResponse updateRole(Long id, Role role) {
        User user = findById(id);
        user.setRole(role);
        return UserResponse.fromEntity(userRepository.save(user));
    }

    @Transactional
    public UserResponse toggleActive(Long id, boolean active) {
        User user = findById(id);
        user.setActive(active);
        return UserResponse.fromEntity(userRepository.save(user));
    }

    @Transactional
    public void softDelete(Long id) {
        User user = findById(id);
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }
}