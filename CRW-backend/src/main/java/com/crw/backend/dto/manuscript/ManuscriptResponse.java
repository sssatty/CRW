package com.crw.backend.dto.manuscript;

import com.crw.backend.entity.ManuscriptStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ManuscriptResponse {
    private Long id;
    private String title;
    private String targetJournal;
    private ManuscriptStatus status;
    private Long workspaceId;
    private List<ManuscriptVersionResponse> versions;
}
