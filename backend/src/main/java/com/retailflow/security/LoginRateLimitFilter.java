package com.retailflow.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Order(2)
public class LoginRateLimitFilter implements Filter {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String LOGIN_PATH = "/api/auth/login";
    private static final int MAX_REQUESTS = 10;
    private static final int WINDOW_MINUTES = 1;

    private Bucket newBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(MAX_REQUESTS,
                        Refill.intervally(MAX_REQUESTS, Duration.ofMinutes(WINDOW_MINUTES))))
                .build();
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        if ("POST".equalsIgnoreCase(request.getMethod()) &&
                LOGIN_PATH.equals(request.getRequestURI())) {

            String ip = resolveClientIp(request);
            Bucket bucket = buckets.computeIfAbsent(ip, k -> newBucket());

            if (!bucket.tryConsume(1)) {
                ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.TOO_MANY_REQUESTS);
                problem.setTitle("Too Many Requests");
                problem.setDetail("Limite de " + MAX_REQUESTS + " tentativas por minuto excedido.");
                problem.setType(URI.create("https://retailflow.demo/errors/rate-limit"));

                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setHeader("Retry-After", String.valueOf(WINDOW_MINUTES * 60));
                response.setContentType("application/problem+json;charset=UTF-8");
                objectMapper.writeValue(response.getOutputStream(), problem);
                return;
            }
        }

        chain.doFilter(req, res);
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        return (forwarded != null && !forwarded.isBlank())
                ? forwarded.split(",")[0].trim()
                : request.getRemoteAddr();
    }
}
