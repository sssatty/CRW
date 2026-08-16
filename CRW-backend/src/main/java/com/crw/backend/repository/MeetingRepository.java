package com.crw.backend.repository;

import com.crw.backend.entity.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    List<Meeting> findByWorkspaceId(Long workspaceId);
}
