package com.crw.backend.dto.manuscript;

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
public class ManuscriptVersionResponse {
    private Long id;
    private String content;
    private String versionTag;
    private String commitMessage;
    private LocalDateTime createdAt;
    private String authorUsername;
}
