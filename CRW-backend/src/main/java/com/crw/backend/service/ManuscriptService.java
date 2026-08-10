package com.crw.backend.service;

import com.crw.backend.dto.manuscript.ManuscriptCreateRequest;
import com.crw.backend.dto.manuscript.ManuscriptResponse;
import com.crw.backend.dto.manuscript.ManuscriptVersionRequest;
import com.crw.backend.entity.ManuscriptStatus;

import java.util.List;

public interface ManuscriptService {

    ManuscriptResponse createManuscript(ManuscriptCreateRequest request);

    ManuscriptResponse getManuscriptById(Long id);

    List<ManuscriptResponse> getManuscriptsByWorkspace(Long workspaceId);

    ManuscriptResponse updateManuscript(Long id, ManuscriptCreateRequest request);

    ManuscriptResponse updateManuscriptStatus(Long id, ManuscriptStatus status);

    void deleteManuscript(Long id);

    ManuscriptResponse addVersion(Long manuscriptId, ManuscriptVersionRequest request);
}
