package com.crw.backend.dto.meeting;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MeetingCreateRequest {

    @NotBlank
    private String title;

    private String minutes;

    private String keyDecisions;

    private LocalDateTime meetingDate;

    @NotNull
    private Long workspaceId;
}
