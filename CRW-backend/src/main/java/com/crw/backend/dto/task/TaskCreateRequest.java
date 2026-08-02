package com.crw.backend.dto.task;

import com.crw.backend.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TaskCreateRequest {

    @NotBlank
    private String title;

    private String description;

    private TaskStatus status;

    private LocalDateTime dueDate;

    @NotNull
    private Long workspaceId;

    private Long assigneeId;
}
