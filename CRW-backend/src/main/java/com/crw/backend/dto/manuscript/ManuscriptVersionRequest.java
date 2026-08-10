package com.crw.backend.dto.manuscript;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ManuscriptVersionRequest {

    @NotBlank
    private String content;

    @NotBlank
    private String versionTag;

    private String commitMessage;
}
