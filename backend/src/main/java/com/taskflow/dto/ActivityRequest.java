package com.taskflow.dto;

import com.taskflow.model.Activity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ActivityRequest {

    @NotNull(message = "Tipo é obrigatório")
    private Activity.Type type;

    @NotBlank(message = "Título é obrigatório")
    private String title;

    private String description;
    private Long customerId;
    private Long dealId;
    private LocalDateTime dueDate;
    private Long assignedToId;
    private Activity.Priority priority;
}