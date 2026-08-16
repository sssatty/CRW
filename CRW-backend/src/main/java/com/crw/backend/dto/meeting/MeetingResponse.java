package com.crw.backend.dto.meeting;

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
public class MeetingResponse {
    private Long id;
    private String title;
    private String minutes;
    private String keyDecisions;
    private LocalDateTime meetingDate;
    private Long workspaceId;
}
