package com.crw.backend.dto.literature;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnotationResponse {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private String authorUsername;
}
