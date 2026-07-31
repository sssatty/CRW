package com.crw.backend.dto.literature;

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
public class LiteratureResponse {
    private Long id;
    private String title;
    private String authors;
    private Integer publicationYear;
    private String doi;
    private String url;
    private String summary;
    private Long workspaceId;
    private List<AnnotationResponse> annotations;
}
