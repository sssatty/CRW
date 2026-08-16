package com.crw.backend.service;

import com.crw.backend.dto.meeting.MeetingCreateRequest;
import com.crw.backend.dto.meeting.MeetingResponse;

import java.util.List;

public interface MeetingService {

    MeetingResponse createMeeting(MeetingCreateRequest request);

    MeetingResponse getMeetingById(Long id);

    List<MeetingResponse> getMeetingsByWorkspace(Long workspaceId);

    void deleteMeeting(Long id);
}
