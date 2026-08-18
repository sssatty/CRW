package com.crw.backend.dto.chat;

import com.crw.backend.entity.Role;
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
public class ChatMessageResponse {

    private Long id;
    private Long workspaceId;
    private String content;
    private LocalDateTime createdAt;
    private Long senderId;
    private String senderUsername;
    private Role senderRole;
}
