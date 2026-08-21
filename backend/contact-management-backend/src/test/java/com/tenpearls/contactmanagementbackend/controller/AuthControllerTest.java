package com.tenpearls.contactmanagementbackend.controller;

import com.tenpearls.contactmanagementbackend.dto.RegisterRequest;
import com.tenpearls.contactmanagementbackend.entity.User;
import com.tenpearls.contactmanagementbackend.Repository.UserRepository;
import com.tenpearls.contactmanagementbackend.service.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthController authController;

    @Test
    void register_ShouldReturnBadRequest_WhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Test");
        request.setLastName("User");
        request.setEmail("existing@test.com");
        request.setPassword("Test@123");

        when(userRepository.existsByEmail("existing@test.com")).thenReturn(true);

        ResponseEntity<?> response = authController.register(request);

        assertEquals(400, response.getStatusCode().value());
        verify(userRepository, never()).save(any());
    }

    @Test
    void register_ShouldCreateUser_WhenEmailIsNew() {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Test");
        request.setLastName("User");
        request.setEmail("new@test.com");
        request.setPassword("Test@123");

        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(passwordEncoder.encode("Test@123")).thenReturn("hashedPassword");
        when(jwtUtil.generateToken("new@test.com")).thenReturn("fake-jwt-token");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setFirstName("Test");
        savedUser.setLastName("User");
        savedUser.setEmail("new@test.com");

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        ResponseEntity<?> response = authController.register(request);

        assertEquals(200, response.getStatusCode().value());
        verify(userRepository, times(1)).save(any(User.class));
    }
}