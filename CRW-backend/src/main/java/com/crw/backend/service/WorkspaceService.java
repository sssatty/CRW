package com.crw.backend.service;

import com.crw.backend.dto.workspace.WorkspaceCreateRequest;
import com.crw.backend.dto.workspace.WorkspaceResponse;

import java.util.List;

public interface WorkspaceService {

    WorkspaceResponse createWorkspace(WorkspaceCreateRequest request);

    WorkspaceResponse getWorkspaceById(Long id);

    List<WorkspaceResponse> getAllWorkspaces();

    WorkspaceResponse addMemberToWorkspace(Long workspaceId, Long userId);

    WorkspaceResponse removeMemberFromWorkspace(Long workspaceId, Long userId);

    void deleteWorkspace(Long id);
}
