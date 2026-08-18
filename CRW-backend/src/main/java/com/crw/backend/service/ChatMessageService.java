package com.crw.backend.service;

import com.crw.backend.dto.chat.ChatMessageCreateRequest;
import com.crw.backend.dto.chat.ChatMessageResponse;

import java.util.List;

public interface ChatMessageService {

    ChatMessageResponse sendMessage(ChatMessageCreateRequest request);

    List<ChatMessageResponse> getMessagesByWorkspace(Long workspaceId);

    void deleteMessage(Long messageId);
}
