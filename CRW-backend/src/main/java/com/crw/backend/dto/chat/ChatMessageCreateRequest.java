package com.crw.backend.dto.chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageCreateRequest {

    @NotNull(message = "Workspace ID is required")
    private Long workspaceId;

    @NotBlank(message = "Message content cannot be empty")
    private String content;
}
