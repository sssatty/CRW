package com.crw.backend.dto.manuscript;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ManuscriptCreateRequest {

    @NotBlank
    private String title;

    private String targetJournal;

    @NotNull
    private Long workspaceId;
}
