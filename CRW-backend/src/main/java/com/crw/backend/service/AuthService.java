package com.crw.backend.service;

import com.crw.backend.dto.auth.JwtAuthResponse;
import com.crw.backend.dto.auth.LoginRequest;

public interface AuthService {

    JwtAuthResponse login(LoginRequest request);
}
