package com.crw.backend.controller;

import com.crw.backend.dto.chat.ChatMessageCreateRequest;
import com.crw.backend.dto.chat.ChatMessageResponse;
import com.crw.backend.service.ChatMessageService;
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
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatMessageController {

    private final ChatMessageService chatMessageService;

    @PostMapping("/messages")
    public ResponseEntity<ChatMessageResponse> sendMessage(@Valid @RequestBody ChatMessageCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(chatMessageService.sendMessage(request));
    }

    @GetMapping("/workspace/{workspaceId}")
    public ResponseEntity<List<ChatMessageResponse>> getMessagesByWorkspace(@PathVariable Long workspaceId) {
        return ResponseEntity.ok(chatMessageService.getMessagesByWorkspace(workspaceId));
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        chatMessageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}
