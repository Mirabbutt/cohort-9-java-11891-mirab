package com.tenpearls.contactmanagementbackend.controller;

import com.tenpearls.contactmanagementbackend.dto.ContactRequest;
import com.tenpearls.contactmanagementbackend.entity.contact;
import com.tenpearls.contactmanagementbackend.entity.user;
import com.tenpearls.contactmanagementbackend.Repository.ContactRepository;
import com.tenpearls.contactmanagementbackend.Repository.UserRepository;
import com.tenpearls.contactmanagementbackend.service.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContactControllerTest {

    @Mock
    private ContactRepository contactRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private ContactController contactController;

    @Test
    void createContact_ShouldSaveAndReturnContact() {
        String token = "Bearer fake-token";

        when(jwtUtil.extractEmail("fake-token")).thenReturn("test@test.com");

        user currentUser = new user();
        currentUser.setId(1L);
        currentUser.setEmail("test@test.com");

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(currentUser));

        ContactRequest request = new ContactRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmails(new ArrayList<>());
        request.setPhones(new ArrayList<>());

        contact savedContact = new contact();
        savedContact.setId(1L);
        savedContact.setFirstName("John");
        savedContact.setLastName("Doe");
        savedContact.setUser(currentUser);

        when(contactRepository.save(any(contact.class))).thenReturn(savedContact);

        ResponseEntity<?> response = contactController.createContact(request, token);

        assertEquals(200, response.getStatusCode().value());
        verify(contactRepository, times(1)).save(any(contact.class));
    }

    @Test
    void getContactById_ShouldReturnForbidden_WhenContactBelongsToAnotherUser() {
        String token = "Bearer fake-token";

        when(jwtUtil.extractEmail("fake-token")).thenReturn("test@test.com");

        user currentUser = new user();
        currentUser.setId(1L);
        currentUser.setEmail("test@test.com");

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(currentUser));

        user anotherUser = new user();
        anotherUser.setId(2L);

        contact someoneElsesContact = new contact();
        someoneElsesContact.setId(5L);
        someoneElsesContact.setUser(anotherUser);

        when(contactRepository.findByIdWithEmails(5L)).thenReturn(Optional.of(someoneElsesContact));

        ResponseEntity<?> response = contactController.getContactById(5L, token);

        assertEquals(403, response.getStatusCode().value());
    }
}