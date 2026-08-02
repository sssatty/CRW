package com.crw.backend.controller;

import com.crw.backend.dto.task.TaskAssignRequest;
import com.crw.backend.dto.task.TaskCreateRequest;
import com.crw.backend.dto.task.TaskResponse;
import com.crw.backend.dto.task.TaskStatusUpdateRequest;
import com.crw.backend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @GetMapping("/workspace/{workspaceId}")
    public ResponseEntity<List<TaskResponse>> getTasksByWorkspace(@PathVariable Long workspaceId) {
        return ResponseEntity.ok(taskService.getTasksByWorkspace(workspaceId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(@PathVariable Long id, @Valid @RequestBody TaskStatusUpdateRequest request) {
        return ResponseEntity.ok(taskService.updateTaskStatus(id, request.getStatus()));
    }

    @PatchMapping("/{id}/assignee")
    public ResponseEntity<TaskResponse> assignTask(@PathVariable Long id, @Valid @RequestBody TaskAssignRequest request) {
        return ResponseEntity.ok(taskService.assignTask(id, request.getAssigneeId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
