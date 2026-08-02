package com.crw.backend.service;

import com.crw.backend.dto.task.TaskCreateRequest;
import com.crw.backend.dto.task.TaskResponse;
import com.crw.backend.entity.TaskStatus;

import java.util.List;

public interface TaskService {

    TaskResponse createTask(TaskCreateRequest request);

    TaskResponse getTaskById(Long id);

    List<TaskResponse> getTasksByWorkspace(Long workspaceId);

    TaskResponse updateTaskStatus(Long id, TaskStatus status);

    TaskResponse assignTask(Long id, Long assigneeId);

    void deleteTask(Long id);
}
