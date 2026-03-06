package com.taskflow.service;

import com.taskflow.dto.NotificationResponse;
import com.taskflow.model.Notification;
import com.taskflow.model.User;
import com.taskflow.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return (User) userService.loadUserByUsername(email);
    }

    public List<NotificationResponse> getUnread() {
        return notificationRepository
                .findByUserIdAndReadFalseOrderByCreatedAtDesc(getCurrentUser().getId())
                .stream().map(NotificationResponse::fromEntity).toList();
    }

    public Map<String, Long> getCount() {
        return Map.of("unread", notificationRepository.countByUserIdAndReadFalse(getCurrentUser().getId()));
    }

    @Transactional
    public NotificationResponse markRead(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificação não encontrada"));
        n.setRead(true);
        n.setReadAt(LocalDateTime.now());
        return NotificationResponse.fromEntity(notificationRepository.save(n));
    }

    @Transactional
    public void markAllRead() {
        notificationRepository.markAllRead(getCurrentUser().getId());
    }

    public void create(User user, Notification.Type type, String title, String message, String link) {
        Notification n = new Notification();
        n.setUser(user);
        n.setType(type);
        n.setTitle(title);
        n.setMessage(message);
        n.setLink(link);
        notificationRepository.save(n);
    }
}