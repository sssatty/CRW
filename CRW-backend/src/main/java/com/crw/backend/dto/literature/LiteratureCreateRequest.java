package com.crw.backend.dto.literature;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LiteratureCreateRequest {

    @NotBlank
    private String title;

    private String authors;

    private Integer publicationYear;

    private String doi;

    private String url;

    private String summary;

    @NotNull
    private Long workspaceId;
}
