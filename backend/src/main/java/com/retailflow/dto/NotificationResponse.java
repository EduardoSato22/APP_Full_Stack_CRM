package com.retailflow.dto;

import com.retailflow.model.Notification;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponse {
    private Long id;
    private Notification.Type type;
    private String title;
    private String message;
    private boolean read;
    private String link;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;

    public static NotificationResponse fromEntity(Notification n) {
        NotificationResponse r = new NotificationResponse();
        r.setId(n.getId());
        r.setType(n.getType());
        r.setTitle(n.getTitle());
        r.setMessage(n.getMessage());
        r.setRead(n.isRead());
        r.setLink(n.getLink());
        r.setCreatedAt(n.getCreatedAt());
        r.setReadAt(n.getReadAt());
        return r;
    }
}