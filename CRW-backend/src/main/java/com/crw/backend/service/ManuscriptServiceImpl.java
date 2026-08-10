package com.crw.backend.service;

import com.crw.backend.dto.manuscript.ManuscriptCreateRequest;
import com.crw.backend.dto.manuscript.ManuscriptResponse;
import com.crw.backend.dto.manuscript.ManuscriptVersionRequest;
import com.crw.backend.dto.manuscript.ManuscriptVersionResponse;
import com.crw.backend.entity.Manuscript;
import com.crw.backend.entity.ManuscriptStatus;
import com.crw.backend.entity.ManuscriptVersion;
import com.crw.backend.entity.User;
import com.crw.backend.entity.Workspace;
import com.crw.backend.exception.ResourceNotFoundException;
import com.crw.backend.repository.ManuscriptRepository;
import com.crw.backend.repository.WorkspaceRepository;
import com.crw.backend.security.WorkspaceAccessGuard;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ManuscriptServiceImpl implements ManuscriptService {

    private final ManuscriptRepository manuscriptRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceAccessGuard accessGuard;

    @Override
    public ManuscriptResponse createManuscript(ManuscriptCreateRequest request) {
        Workspace workspace = findWorkspaceOrThrow(request.getWorkspaceId());
        accessGuard.requireMember(workspace);

        Manuscript manuscript = Manuscript.builder()
                .title(request.getTitle())
                .targetJournal(request.getTargetJournal())
                .status(ManuscriptStatus.DRAFT)
                .workspace(workspace)
                .build();

        return toResponse(manuscriptRepository.save(manuscript));
    }

    @Override
    @Transactional(readOnly = true)
    public ManuscriptResponse getManuscriptById(Long id) {
        Manuscript manuscript = findManuscriptOrThrow(id);
        accessGuard.requireMember(manuscript.getWorkspace());
        return toResponse(manuscript);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ManuscriptResponse> getManuscriptsByWorkspace(Long workspaceId) {
        Workspace workspace = findWorkspaceOrThrow(workspaceId);
        accessGuard.requireMember(workspace);
        return manuscriptRepository.findByWorkspaceId(workspaceId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public ManuscriptResponse updateManuscript(Long id, ManuscriptCreateRequest request) {
        Manuscript manuscript = findManuscriptOrThrow(id);
        accessGuard.requireMember(manuscript.getWorkspace());

        Workspace targetWorkspace = findWorkspaceOrThrow(request.getWorkspaceId());
        accessGuard.requireMember(targetWorkspace);

        manuscript.setTitle(request.getTitle());
        manuscript.setTargetJournal(request.getTargetJournal());
        manuscript.setWorkspace(targetWorkspace);
        return toResponse(manuscript);
    }

    @Override
    public ManuscriptResponse updateManuscriptStatus(Long id, ManuscriptStatus status) {
        Manuscript manuscript = findManuscriptOrThrow(id);
        accessGuard.requireMember(manuscript.getWorkspace());
        manuscript.setStatus(status);
        return toResponse(manuscript);
    }

    @Override
    public void deleteManuscript(Long id) {
        Manuscript manuscript = findManuscriptOrThrow(id);
        accessGuard.requireMember(manuscript.getWorkspace());
        manuscriptRepository.delete(manuscript);
    }

    @Override
    public ManuscriptResponse addVersion(Long manuscriptId, ManuscriptVersionRequest request) {
        Manuscript manuscript = findManuscriptOrThrow(manuscriptId);
        User author = accessGuard.requireMember(manuscript.getWorkspace());

        ManuscriptVersion version = ManuscriptVersion.builder()
                .content(request.getContent())
                .versionTag(request.getVersionTag())
                .commitMessage(request.getCommitMessage())
                .createdAt(LocalDateTime.now())
                .manuscript(manuscript)
                .author(author)
                .build();

        manuscript.getVersions().add(version);
        return toResponse(manuscript);
    }

    private Manuscript findManuscriptOrThrow(Long id) {
        return manuscriptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Manuscript not found with id: " + id));
    }

    private Workspace findWorkspaceOrThrow(Long id) {
        return workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found with id: " + id));
    }

    private ManuscriptResponse toResponse(Manuscript manuscript) {
        return ManuscriptResponse.builder()
                .id(manuscript.getId())
                .title(manuscript.getTitle())
                .targetJournal(manuscript.getTargetJournal())
                .status(manuscript.getStatus())
                .workspaceId(manuscript.getWorkspace().getId())
                .versions(manuscript.getVersions().stream()
                        .map(this::toVersionResponse)
                        .toList())
                .build();
    }

    private ManuscriptVersionResponse toVersionResponse(ManuscriptVersion version) {
        return ManuscriptVersionResponse.builder()
                .id(version.getId())
                .content(version.getContent())
                .versionTag(version.getVersionTag())
                .commitMessage(version.getCommitMessage())
                .createdAt(version.getCreatedAt())
                .authorUsername(version.getAuthor() != null ? version.getAuthor().getUsername() : null)
                .build();
    }
}
