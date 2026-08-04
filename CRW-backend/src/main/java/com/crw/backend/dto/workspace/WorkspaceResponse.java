package com.crw.backend.dto.workspace;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkspaceResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private List<WorkspaceMemberSummary> members;
}
