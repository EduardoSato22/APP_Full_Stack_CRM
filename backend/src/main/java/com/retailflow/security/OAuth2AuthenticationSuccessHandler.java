package com.retailflow.security;

import com.retailflow.model.Role;
import com.retailflow.model.User;
import com.retailflow.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = extractEmail(oAuth2User);
        if (email == null) {
            log.warn("OAuth2 login: email não disponível para {}", authentication.getName());
            getRedirectStrategy().sendRedirect(request, response,
                    frontendUrl + "/oauth2/callback?error=email_required");
            return;
        }

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setName(extractName(oAuth2User, email));
            newUser.setEmail(email);
            newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            newUser.setRole(Role.USER);
            newUser.setActive(true);
            String avatar = extractAvatar(oAuth2User);
            if (avatar != null) newUser.setAvatar(avatar);
            log.info("OAuth2: novo usuário criado via social login: {}", email);
            return userRepository.save(newUser);
        });

        String token = jwtService.generateToken(user);
        getRedirectStrategy().sendRedirect(request, response,
                frontendUrl + "/oauth2/callback?token=" + token);
    }

    private String extractEmail(OAuth2User user) {
        Object email = user.getAttribute("email");
        if (email != null && !email.toString().isBlank()) return email.toString();
        // GitHub: fallback para noreply email
        Object login = user.getAttribute("login");
        return login != null ? login + "@users.noreply.github.com" : null;
    }

    private String extractName(OAuth2User user, String fallback) {
        Object name = user.getAttribute("name");
        if (name != null && !name.toString().isBlank()) return name.toString();
        Object login = user.getAttribute("login");
        return login != null ? login.toString() : fallback;
    }

    private String extractAvatar(OAuth2User user) {
        Object picture = user.getAttribute("picture");     // Google
        if (picture != null) return picture.toString();
        Object avatarUrl = user.getAttribute("avatar_url"); // GitHub
        return avatarUrl != null ? avatarUrl.toString() : null;
    }
}
