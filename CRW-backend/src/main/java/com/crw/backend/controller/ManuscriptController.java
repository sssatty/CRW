package com.crw.backend.controller;

import com.crw.backend.dto.manuscript.ManuscriptCreateRequest;
import com.crw.backend.dto.manuscript.ManuscriptResponse;
import com.crw.backend.dto.manuscript.ManuscriptStatusUpdateRequest;
import com.crw.backend.dto.manuscript.ManuscriptVersionRequest;
import com.crw.backend.service.ManuscriptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/manuscripts")
@RequiredArgsConstructor
public class ManuscriptController {

    private final ManuscriptService manuscriptService;

    @PostMapping
    public ResponseEntity<ManuscriptResponse> createManuscript(@Valid @RequestBody ManuscriptCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(manuscriptService.createManuscript(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ManuscriptResponse> getManuscriptById(@PathVariable Long id) {
        return ResponseEntity.ok(manuscriptService.getManuscriptById(id));
    }

    @GetMapping("/workspace/{workspaceId}")
    public ResponseEntity<List<ManuscriptResponse>> getManuscriptsByWorkspace(@PathVariable Long workspaceId) {
        return ResponseEntity.ok(manuscriptService.getManuscriptsByWorkspace(workspaceId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ManuscriptResponse> updateManuscript(@PathVariable Long id, @Valid @RequestBody ManuscriptCreateRequest request) {
        return ResponseEntity.ok(manuscriptService.updateManuscript(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ManuscriptResponse> updateManuscriptStatus(@PathVariable Long id, @Valid @RequestBody ManuscriptStatusUpdateRequest request) {
        return ResponseEntity.ok(manuscriptService.updateManuscriptStatus(id, request.getStatus()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteManuscript(@PathVariable Long id) {
        manuscriptService.deleteManuscript(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/versions")
    public ResponseEntity<ManuscriptResponse> addVersion(@PathVariable Long id, @Valid @RequestBody ManuscriptVersionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(manuscriptService.addVersion(id, request));
    }
}
