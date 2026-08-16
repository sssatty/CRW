package com.crw.backend.controller;

import com.crw.backend.dto.meeting.MeetingCreateRequest;
import com.crw.backend.dto.meeting.MeetingResponse;
import com.crw.backend.service.MeetingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/meetings")
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingService meetingService;

    @PostMapping
    public ResponseEntity<MeetingResponse> createMeeting(@Valid @RequestBody MeetingCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(meetingService.createMeeting(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MeetingResponse> getMeetingById(@PathVariable Long id) {
        return ResponseEntity.ok(meetingService.getMeetingById(id));
    }

    @GetMapping("/workspace/{workspaceId}")
    public ResponseEntity<List<MeetingResponse>> getMeetingsByWorkspace(@PathVariable Long workspaceId) {
        return ResponseEntity.ok(meetingService.getMeetingsByWorkspace(workspaceId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeeting(@PathVariable Long id) {
        meetingService.deleteMeeting(id);
        return ResponseEntity.noContent().build();
    }
}
