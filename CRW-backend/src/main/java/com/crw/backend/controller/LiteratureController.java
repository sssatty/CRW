package com.crw.backend.controller;

import com.crw.backend.dto.literature.AnnotationCreateRequest;
import com.crw.backend.dto.literature.LiteratureCreateRequest;
import com.crw.backend.dto.literature.LiteratureResponse;
import com.crw.backend.entity.Workspace;
import com.crw.backend.exception.ResourceNotFoundException;
import com.crw.backend.repository.WorkspaceRepository;
import com.crw.backend.security.WorkspaceAccessGuard;
import com.crw.backend.service.LiteratureService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/literature")
@RequiredArgsConstructor
public class LiteratureController {

    private final LiteratureService literatureService;
    private final WorkspaceAccessGuard workspaceAccessGuard;
    private final WorkspaceRepository workspaceRepository;

    @PostMapping
    public ResponseEntity<LiteratureResponse> createLiterature(@Valid @RequestBody LiteratureCreateRequest request) {
        Workspace workspace = workspaceRepository.findById(request.getWorkspaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found: " + request.getWorkspaceId()));
        workspaceAccessGuard.requireMember(workspace);
        LiteratureResponse created = literatureService.createLiterature(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LiteratureResponse> getLiteratureById(@PathVariable Long id) {
        return ResponseEntity.ok(literatureService.getLiteratureById(id));
    }

    @GetMapping("/workspace/{workspaceId}")
    public ResponseEntity<List<LiteratureResponse>> getLiteratureByWorkspace(@PathVariable Long workspaceId) {
        return ResponseEntity.ok(literatureService.getLiteratureByWorkspace(workspaceId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LiteratureResponse> updateLiterature(@PathVariable Long id, @Valid @RequestBody LiteratureCreateRequest request) {
        return ResponseEntity.ok(literatureService.updateLiterature(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLiterature(@PathVariable Long id) {
        literatureService.deleteLiterature(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/annotations")
    public ResponseEntity<LiteratureResponse> addAnnotation(@PathVariable Long id, @Valid @RequestBody AnnotationCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(literatureService.addAnnotation(id, request));
    }
}
