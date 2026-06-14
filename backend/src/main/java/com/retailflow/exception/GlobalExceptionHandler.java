package com.retailflow.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetail> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> fieldErrors = ex.getBindingResult().getAllErrors().stream()
                .collect(Collectors.toMap(
                        e -> e instanceof FieldError fe ? fe.getField() : e.getObjectName(),
                        e -> e.getDefaultMessage() != null ? e.getDefaultMessage() : "inválido"
                ));
        ProblemDetail problem = problem(HttpStatus.UNPROCESSABLE_ENTITY,
                "Validation Error", "Campos com valores inválidos", request);
        problem.setProperty("errors", fieldErrors);
        return ResponseEntity.unprocessableEntity()
                .header("Content-Type", "application/problem+json")
                .body(problem);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ProblemDetail> handleAccessDenied(
            AccessDeniedException ex, HttpServletRequest request) {
        return problemResponse(HttpStatus.FORBIDDEN, "Access Denied", ex.getMessage(), request);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ProblemDetail> handleNotFound(
            ResourceNotFoundException ex, HttpServletRequest request) {
        return problemResponse(HttpStatus.NOT_FOUND, "Resource Not Found", ex.getMessage(), request);
    }

    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<ProblemDetail> handleBusinessRule(
            BusinessRuleException ex, HttpServletRequest request) {
        return problemResponse(HttpStatus.BAD_REQUEST, "Business Rule Violation", ex.getMessage(), request);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ProblemDetail> handleRuntime(
            RuntimeException ex, HttpServletRequest request) {
        return problemResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                "Internal Server Error", ex.getMessage(), request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleGeneric(
            Exception ex, HttpServletRequest request) {
        return problemResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                "Internal Server Error", "Erro interno no servidor", request);
    }

    private ResponseEntity<ProblemDetail> problemResponse(HttpStatus status, String title,
            String detail, HttpServletRequest request) {
        return ResponseEntity.status(status)
                .header("Content-Type", "application/problem+json")
                .body(problem(status, title, detail, request));
    }

    private ProblemDetail problem(HttpStatus status, String title, String detail,
            HttpServletRequest request) {
        ProblemDetail p = ProblemDetail.forStatus(status);
        p.setType(URI.create("https://retailflow.dev/errors/" + status.value()));
        p.setTitle(title);
        p.setDetail(detail);
        p.setInstance(URI.create(request.getRequestURI()));
        p.setProperty("timestamp", Instant.now().toString());
        return p;
    }

}
