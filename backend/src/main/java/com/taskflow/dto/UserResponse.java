package com.taskflow.dto;

import com.taskflow.model.Role;
import com.taskflow.model.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String avatar;
    private String phone;
    private boolean active;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;

    public static UserResponse fromEntity(User u) {
        UserResponse r = new UserResponse();
        r.setId(u.getId());
        r.setName(u.getName());
        r.setEmail(u.getEmail());
        r.setRole(u.getRole());
        r.setAvatar(u.getAvatar());
        r.setPhone(u.getPhone());
        r.setActive(u.isActive());
        r.setLastLoginAt(u.getLastLoginAt());
        r.setCreatedAt(u.getCreatedAt());
        return r;
    }
}