package com.crw.backend.dto.workspace;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkspaceCreateRequest {

    @NotBlank
    private String name;

    private String description;
}
