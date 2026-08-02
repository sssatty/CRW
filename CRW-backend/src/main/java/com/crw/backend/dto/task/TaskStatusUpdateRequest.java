package com.crw.backend.dto.task;

import com.crw.backend.entity.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskStatusUpdateRequest {

    @NotNull
    private TaskStatus status;
}
