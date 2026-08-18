package com.crw.backend.repository;

import com.crw.backend.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByWorkspaceIdOrderByCreatedAtAsc(Long workspaceId);

    void deleteByWorkspaceId(Long workspaceId);
}
