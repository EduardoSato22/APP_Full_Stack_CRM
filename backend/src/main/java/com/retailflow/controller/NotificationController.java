package com.retailflow.controller;

import com.retailflow.dto.NotificationResponse;
import com.retailflow.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Notificações")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Listar não lidas")
    public ResponseEntity<List<NotificationResponse>> getUnread() {
        return ResponseEntity.ok(notificationService.getUnread());
    }

    @GetMapping("/count")
    @Operation(summary = "Contagem de não lidas")
    public ResponseEntity<Map<String, Long>> count() {
        return ResponseEntity.ok(notificationService.getCount());
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Marcar como lida")
    public ResponseEntity<NotificationResponse> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markRead(id));
    }

    @PutMapping("/read-all")
    @Operation(summary = "Marcar todas como lidas")
    public ResponseEntity<Void> markAllRead() {
        notificationService.markAllRead();
        return ResponseEntity.noContent().build();
    }
}