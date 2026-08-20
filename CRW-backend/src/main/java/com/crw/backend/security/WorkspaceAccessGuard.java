package com.crw.backend.security;

import com.crw.backend.entity.User;
import com.crw.backend.entity.Workspace;
import com.crw.backend.exception.ResourceNotFoundException;
import com.crw.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class WorkspaceAccessGuard {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public User currentUser() {
        String identifier = SecurityUtils.getCurrentUsername();
        return userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByUsername(identifier))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + identifier));
    }

    public boolean isMember(Workspace workspace, User user) {
        if (workspace == null || user == null) {
            return false;
        }
        return workspace.getMembers().stream()
                .anyMatch(m -> m.getId().equals(user.getId()));
    }

    public User requireMember(Workspace workspace) {
        User user = currentUser();
        if (!isMember(workspace, user)) {
            throw new AccessDeniedException("Access Denied: You are not a member of this workspace.");
        }
        return user;
    }
}
