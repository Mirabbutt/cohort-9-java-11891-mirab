package com.tenpearls.contactmanagementbackend.service;

import com.tenpearls.contactmanagementbackend.entity.User;
import com.tenpearls.contactmanagementbackend.Repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String identity) throws UsernameNotFoundException {
        User foundUser = userRepository.findByEmail(identity)
                .or(() -> userRepository.findByPhoneNumber(identity))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + identity));

        String username = foundUser.getEmail() != null ? foundUser.getEmail() : foundUser.getPhoneNumber();

        return org.springframework.security.core.userdetails.User.builder()
                .username(username)
                .password(foundUser.getPassword())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")))
                .build();
    }
}
