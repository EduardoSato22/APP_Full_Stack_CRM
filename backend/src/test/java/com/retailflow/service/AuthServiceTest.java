package com.retailflow.service;

import com.retailflow.dto.AuthResponse;
import com.retailflow.dto.LoginRequest;
import com.retailflow.dto.RegisterRequest;
import com.retailflow.model.RefreshToken;
import com.retailflow.model.Role;
import com.retailflow.model.User;
import com.retailflow.repository.RefreshTokenRepository;
import com.retailflow.repository.UserRepository;
import com.retailflow.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UserRepository userRepository;
    @Mock RefreshTokenRepository refreshTokenRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtService jwtService;
    @Mock AuthenticationManager authenticationManager;

    @InjectMocks AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setName("Eduardo Sato");
        user.setEmail("edu@test.com");
        user.setRole(Role.ADMIN);

        RefreshToken rt = new RefreshToken();
        rt.setToken("refresh-uuid");
        rt.setUser(user);
        rt.setExpiresAt(LocalDateTime.now().plusDays(7));
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(rt);
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt-token");
        when(jwtService.getExpiration()).thenReturn(900000L);
    }

    @Test
    void register_createsUserAndReturnsTokens() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Eduardo Sato");
        request.setEmail("edu@test.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail("edu@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed-pass");
        when(userRepository.save(any(User.class))).thenReturn(user);

        AuthResponse response = authService.register(request);

        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getUserId()).isEqualTo(1L);
        verify(passwordEncoder).encode("password123");
    }

    @Test
    void register_throwsWhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("edu@test.com");
        when(userRepository.existsByEmail("edu@test.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("cadastrado");
    }

    @Test
    void login_authenticatesAndReturnsTokens() {
        LoginRequest request = new LoginRequest();
        request.setEmail("edu@test.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("edu@test.com")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        AuthResponse response = authService.login(request);

        assertThat(response.getToken()).isEqualTo("jwt-token");
        verify(authenticationManager).authenticate(any());
        verify(userRepository).save(user); // updates lastLoginAt
    }

    @Test
    void login_throwsBadCredentials_whenAuthFails() {
        LoginRequest request = new LoginRequest();
        request.setEmail("edu@test.com");
        request.setPassword("wrong");

        doThrow(new BadCredentialsException("Bad credentials"))
                .when(authenticationManager).authenticate(any());

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void refresh_returnsNewTokensForValidToken() {
        RefreshToken rt = new RefreshToken();
        rt.setToken("valid-refresh");
        rt.setUser(user);
        rt.setExpiresAt(LocalDateTime.now().plusDays(5));

        when(refreshTokenRepository.findByTokenAndRevokedFalse("valid-refresh")).thenReturn(Optional.of(rt));

        AuthResponse response = authService.refresh("valid-refresh");

        assertThat(response.getToken()).isEqualTo("jwt-token");
    }

    @Test
    void refresh_throwsWhenTokenRevoked() {
        when(refreshTokenRepository.findByTokenAndRevokedFalse("bad-token")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.refresh("bad-token"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("inválido");
    }

    @Test
    void refresh_throwsWhenTokenExpired() {
        RefreshToken rt = new RefreshToken();
        rt.setToken("expired-token");
        rt.setUser(user);
        rt.setExpiresAt(LocalDateTime.now().minusDays(1)); // expired

        when(refreshTokenRepository.findByTokenAndRevokedFalse("expired-token")).thenReturn(Optional.of(rt));

        assertThatThrownBy(() -> authService.refresh("expired-token"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("expirado");
    }

    @Test
    void logout_revokesAllTokensForUser() {
        authService.logout(1L);
        verify(refreshTokenRepository).revokeAllByUserId(1L);
    }
}
