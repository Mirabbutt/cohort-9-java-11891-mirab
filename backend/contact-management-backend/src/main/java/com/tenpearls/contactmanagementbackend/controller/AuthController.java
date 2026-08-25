package com.tenpearls.contactmanagementbackend.controller;

import com.tenpearls.contactmanagementbackend.dto.*;
import com.tenpearls.contactmanagementbackend.entity.User;
import com.tenpearls.contactmanagementbackend.Repository.UserRepository;
import com.tenpearls.contactmanagementbackend.service.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AuthController.class);
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

        String email = request.getEmail() != null && !request.getEmail().isBlank() ? request.getEmail().trim() : null;
        String phoneNumber = request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank() ? request.getPhoneNumber().trim() : null;

        if (email == null && phoneNumber == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email or phone number is required"));
        }

        if (email != null && userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already registered"));
        }

        if (phoneNumber != null && userRepository.existsByPhoneNumber(phoneNumber)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Phone number already registered"));
        }

        User newUser = new User();
        newUser.setFirstName(request.getFirstName());
        newUser.setLastName(request.getLastName());
        newUser.setEmail(email);
        newUser.setPhoneNumber(phoneNumber);
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(newUser);

        String identity = email != null ? email : phoneNumber;
        String token = jwtUtil.generateToken(identity);


        log.info("New user registered with id: {}", newUser.getId());

        AuthResponse response = new AuthResponse(token, newUser.getId(), newUser.getFirstName(),
                newUser.getLastName(), newUser.getEmail());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {

        User foundUser = userRepository.findByEmail(request.getUsernameOrPhone())
                .or(() -> userRepository.findByPhoneNumber(request.getUsernameOrPhone()))
                .orElse(null);

        if (foundUser == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }

        String identity = foundUser.getEmail() != null ? foundUser.getEmail() : foundUser.getPhoneNumber();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(identity, request.getPassword())
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }

        String token = jwtUtil.generateToken(identity);

        log.info("User logged in with id: {}", foundUser.getId());

        AuthResponse response = new AuthResponse(token, foundUser.getId(), foundUser.getFirstName(),
                foundUser.getLastName(), foundUser.getEmail());

        return ResponseEntity.ok(response);
    }
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request,
                                            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ") || authHeader.length() <= 7) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid or missing token"));
        }

        String token = authHeader.substring(7);
        String email;
        try {
            email = jwtUtil.extractEmail(token);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid or expired token"));
        }

        User foundUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new com.tenpearls.contactmanagementbackend.exception.ResourceNotFoundException("User not found"));



        if (!passwordEncoder.matches(request.getOldPassword(), foundUser.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Old password is incorrect"));
        }

        foundUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(foundUser);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}