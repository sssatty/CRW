package com.crw.backend.service;

import com.crw.backend.dto.chat.ChatMessageCreateRequest;
import com.crw.backend.dto.chat.ChatMessageResponse;
import com.crw.backend.entity.ChatMessage;
import com.crw.backend.entity.Role;
import com.crw.backend.entity.User;
import com.crw.backend.entity.Workspace;
import com.crw.backend.exception.ResourceNotFoundException;
import com.crw.backend.repository.ChatMessageRepository;
import com.crw.backend.repository.WorkspaceRepository;
import com.crw.backend.security.WorkspaceAccessGuard;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceAccessGuard accessGuard;

    @Override
    public ChatMessageResponse sendMessage(ChatMessageCreateRequest request) {
        Workspace workspace = findWorkspaceOrThrow(request.getWorkspaceId());
        User sender = accessGuard.requireMember(workspace);

        ChatMessage chatMessage = ChatMessage.builder()
                .content(request.getContent().trim())
                .createdAt(LocalDateTime.now())
                .sender(sender)
                .workspace(workspace)
                .build();

        return toResponse(chatMessageRepository.save(chatMessage));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getMessagesByWorkspace(Long workspaceId) {
        Workspace workspace = findWorkspaceOrThrow(workspaceId);
        accessGuard.requireMember(workspace);

        return chatMessageRepository.findByWorkspaceIdOrderByCreatedAtAsc(workspaceId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void deleteMessage(Long messageId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat message not found with id: " + messageId));

        User currentUser = accessGuard.requireMember(message.getWorkspace());

        boolean isSender = message.getSender().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isSender && !isAdmin) {
            throw new AccessDeniedException("Access Denied: Only the message author or workspace admin can delete messages.");
        }

        chatMessageRepository.delete(message);
    }

    private Workspace findWorkspaceOrThrow(Long id) {
        return workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found with id: " + id));
    }

    private ChatMessageResponse toResponse(ChatMessage message) {
        return ChatMessageResponse.builder()
                .id(message.getId())
                .workspaceId(message.getWorkspace().getId())
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .senderId(message.getSender().getId())
                .senderUsername(message.getSender().getUsername())
                .senderRole(message.getSender().getRole())
                .build();
    }
}
