package com.crw.backend.service;

import com.crw.backend.dto.user.UserCreateRequest;
import com.crw.backend.dto.user.UserResponse;
import com.crw.backend.dto.user.UserUpdateRequest;

import java.util.List;

public interface UserService {

    UserResponse createUser(UserCreateRequest request);

    UserResponse getUserById(Long id);

    UserResponse getCurrentUser();

    UserResponse getCurrentUserProfile();

    List<UserResponse> getAllUsers();

    UserResponse updateUser(Long id, UserUpdateRequest request);

    void deleteUser(Long id);
}
