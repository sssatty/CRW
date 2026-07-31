package com.crw.backend.service;

import com.crw.backend.dto.literature.AnnotationCreateRequest;
import com.crw.backend.dto.literature.LiteratureCreateRequest;
import com.crw.backend.dto.literature.LiteratureResponse;

import java.util.List;

public interface LiteratureService {

    LiteratureResponse createLiterature(LiteratureCreateRequest request);

    LiteratureResponse getLiteratureById(Long id);

    List<LiteratureResponse> getLiteratureByWorkspace(Long workspaceId);

    LiteratureResponse updateLiterature(Long id, LiteratureCreateRequest request);

    void deleteLiterature(Long id);

    LiteratureResponse addAnnotation(Long literatureId, AnnotationCreateRequest request);
}
