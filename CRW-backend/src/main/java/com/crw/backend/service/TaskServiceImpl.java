package com.crw.backend.service;

import com.crw.backend.dto.task.TaskCreateRequest;
import com.crw.backend.dto.task.TaskResponse;
import com.crw.backend.entity.Task;
import com.crw.backend.entity.TaskStatus;
import com.crw.backend.entity.User;
import com.crw.backend.entity.Workspace;
import com.crw.backend.exception.ResourceNotFoundException;
import com.crw.backend.repository.TaskRepository;
import com.crw.backend.repository.UserRepository;
import com.crw.backend.repository.WorkspaceRepository;
import com.crw.backend.security.WorkspaceAccessGuard;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;
    private final WorkspaceAccessGuard accessGuard;

    @Override
    public TaskResponse createTask(TaskCreateRequest request) {
        Workspace workspace = findWorkspaceOrThrow(request.getWorkspaceId());
        accessGuard.requireMember(workspace);
        User assignee = resolveAndValidateAssignee(workspace, request.getAssigneeId());

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .dueDate(request.getDueDate())
                .workspace(workspace)
                .assignee(assignee)
                .build();

        return toResponse(taskRepository.save(task));
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        Task task = findTaskOrThrow(id);
        accessGuard.requireMember(task.getWorkspace());
        return toResponse(task);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByWorkspace(Long workspaceId) {
        Workspace workspace = findWorkspaceOrThrow(workspaceId);
        accessGuard.requireMember(workspace);
        return taskRepository.findByWorkspaceId(workspaceId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public TaskResponse updateTaskStatus(Long id, TaskStatus status) {
        Task task = findTaskOrThrow(id);
        accessGuard.requireMember(task.getWorkspace());
        task.setStatus(status);
        return toResponse(task);
    }

    @Override
    public TaskResponse assignTask(Long id, Long assigneeId) {
        Task task = findTaskOrThrow(id);
        accessGuard.requireMember(task.getWorkspace());
        User assignee = resolveAndValidateAssignee(task.getWorkspace(), assigneeId);
        task.setAssignee(assignee);
        return toResponse(task);
    }

    @Override
    public void deleteTask(Long id) {
        Task task = findTaskOrThrow(id);
        accessGuard.requireMember(task.getWorkspace());
        taskRepository.delete(task);
    }

    private User resolveAndValidateAssignee(Workspace workspace, Long assigneeId) {
        if (assigneeId == null) {
            return null;
        }
        User user = userRepository.findById(assigneeId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + assigneeId));
        if (!accessGuard.isMember(workspace, user)) {
            throw new IllegalArgumentException("Assigned user is not a member of this workspace.");
        }
        return user;
    }

    private Task findTaskOrThrow(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    private Workspace findWorkspaceOrThrow(Long id) {
        return workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found with id: " + id));
    }

    private TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .dueDate(task.getDueDate())
                .workspaceId(task.getWorkspace().getId())
                .workspaceName(task.getWorkspace().getName())
                .assigneeId(task.getAssignee() != null ? task.getAssignee().getId() : null)
                .assigneeUsername(task.getAssignee() != null ? task.getAssignee().getUsername() : null)
                .build();
    }
}
