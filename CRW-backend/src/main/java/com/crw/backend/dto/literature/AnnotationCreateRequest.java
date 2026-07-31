package com.crw.backend.dto.literature;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnnotationCreateRequest {

    @NotBlank
    private String content;
}
