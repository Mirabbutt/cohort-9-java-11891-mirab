package com.tenpearls.contactmanagementbackend.controller;

import com.tenpearls.contactmanagementbackend.dto.*;
import com.tenpearls.contactmanagementbackend.entity.user;
import com.tenpearls.contactmanagementbackend.Repository.UserRepository;
import com.tenpearls.contactmanagementbackend.service.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {

        if (request.getEmail() == null && request.getPhoneNumber() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email or phone number is required"));
        }

        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already registered"));
        }

        if (request.getPhoneNumber() != null && userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Phone number already registered"));
        }

        user newUser = new user();
        newUser.setFirstName(request.getFirstName());
        newUser.setLastName(request.getLastName());
        newUser.setEmail(request.getEmail());
        newUser.setPhoneNumber(request.getPhoneNumber());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(newUser);

        String token = jwtUtil.generateToken(newUser.getEmail());

        AuthResponse response = new AuthResponse(token, newUser.getId(), newUser.getFirstName(),
                newUser.getLastName(), newUser.getEmail());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {

        user foundUser = userRepository.findByEmail(request.getUsernameOrPhone())
                .or(() -> userRepository.findByPhoneNumber(request.getUsernameOrPhone()))
                .orElse(null);

        if (foundUser == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(foundUser.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }

        String token = jwtUtil.generateToken(foundUser.getEmail());

        AuthResponse response = new AuthResponse(token, foundUser.getId(), foundUser.getFirstName(),
                foundUser.getLastName(), foundUser.getEmail());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request,
                                            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        user foundUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), foundUser.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Old password is incorrect"));
        }

        foundUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(foundUser);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
