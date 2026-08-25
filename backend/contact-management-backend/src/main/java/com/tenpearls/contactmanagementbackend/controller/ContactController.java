package com.tenpearls.contactmanagementbackend.controller;

import com.tenpearls.contactmanagementbackend.dto.ContactRequest;
import com.tenpearls.contactmanagementbackend.dto.ContactResponse;
import com.tenpearls.contactmanagementbackend.entity.Contact;
import com.tenpearls.contactmanagementbackend.entity.ContactEmail;
import com.tenpearls.contactmanagementbackend.entity.ContactPhone;
import com.tenpearls.contactmanagementbackend.entity.User;
import com.tenpearls.contactmanagementbackend.Repository.ContactRepository;
import com.tenpearls.contactmanagementbackend.Repository.UserRepository;
import com.tenpearls.contactmanagementbackend.exception.ResourceNotFoundException;
import com.tenpearls.contactmanagementbackend.exception.AccessDeniedException;
import com.tenpearls.contactmanagementbackend.service.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ContactController.class);

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public ContactController(ContactRepository contactRepository, UserRepository userRepository, JwtUtil jwtUtil) {
        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    private User getCurrentUser(String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ContactResponse toResponse(Contact c) {
        List<ContactRequest.EmailDto> emails = c.getEmails().stream()
                .map(e -> {
                    ContactRequest.EmailDto dto = new ContactRequest.EmailDto();
                    dto.setEmail(e.getEmail());
                    dto.setLabel(e.getLabel());
                    return dto;
                }).collect(Collectors.toList());

        List<ContactRequest.PhoneDto> phones = c.getPhones().stream()
                .map(p -> {
                    ContactRequest.PhoneDto dto = new ContactRequest.PhoneDto();
                    dto.setPhoneNumber(p.getPhoneNumber());
                    dto.setLabel(p.getLabel());
                    return dto;
                }).collect(Collectors.toList());

        return new ContactResponse(c.getId(), c.getFirstName(), c.getLastName(), c.getTitle(), emails, phones);
    }

    @PostMapping
    public ResponseEntity<?> createContact(@Valid @RequestBody ContactRequest request,
                                           @RequestHeader("Authorization") String authHeader) {
        User currentUser = getCurrentUser(authHeader);

        Contact newContact = new Contact();
        newContact.setFirstName(request.getFirstName());
        newContact.setLastName(request.getLastName());
        newContact.setTitle(request.getTitle());
        newContact.setUser(currentUser);

        List<ContactEmail> emails = new ArrayList<>();
        if (request.getEmails() != null) {
            for (ContactRequest.EmailDto e : request.getEmails()) {
                ContactEmail email = new ContactEmail();
                email.setEmail(e.getEmail());
                email.setLabel(e.getLabel());
                email.setContact(newContact);
                emails.add(email);
            }
        }
        newContact.setEmails(emails);

        List<ContactPhone> phones = new ArrayList<>();
        if (request.getPhones() != null) {
            for (ContactRequest.PhoneDto p : request.getPhones()) {
                ContactPhone phone = new ContactPhone();
                phone.setPhoneNumber(p.getPhoneNumber());
                phone.setLabel(p.getLabel());
                phone.setContact(newContact);
                phones.add(phone);
            }
        }
        newContact.setPhones(phones);

        Contact saved = contactRepository.save(newContact);
        log.info("Contact created: {} for user id: {}", saved.getId(), currentUser.getId());

        return ResponseEntity.ok(toResponse(saved));
    }

    @GetMapping
        public ResponseEntity<?> getAllContacts(@RequestHeader("Authorization") String authHeader,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
            User currentUser = getCurrentUser(authHeader);
            size = Math.min(size, 50);
            Pageable pageable = PageRequest.of(page, size);

        Page<Contact> contactsPage = contactRepository.findByUser(currentUser, pageable);

        List<ContactResponse> responses = contactsPage.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "contacts", responses,
                "currentPage", contactsPage.getNumber(),
                "totalItems", contactsPage.getTotalElements(),
                "totalPages", contactsPage.getTotalPages()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getContactById(@PathVariable Long id,
                                            @RequestHeader("Authorization") String authHeader) {
        User currentUser = getCurrentUser(authHeader);

        Contact foundContact = contactRepository.findByIdWithEmails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));

        if (!foundContact.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Access denied");
        }

        return ResponseEntity.ok(toResponse(foundContact));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateContact(@PathVariable Long id,
                                           @Valid @RequestBody ContactRequest request,
                                           @RequestHeader("Authorization") String authHeader) {
        User currentUser = getCurrentUser(authHeader);

        Contact existingContact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));

        if (!existingContact.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Access denied");
        }

        existingContact.setFirstName(request.getFirstName());
        existingContact.setLastName(request.getLastName());
        existingContact.setTitle(request.getTitle());

        existingContact.getEmails().clear();
        if (request.getEmails() != null) {
            for (ContactRequest.EmailDto e : request.getEmails()) {
                ContactEmail email = new ContactEmail();
                email.setEmail(e.getEmail());
                email.setLabel(e.getLabel());
                email.setContact(existingContact);
                existingContact.getEmails().add(email);
            }
        }

        existingContact.getPhones().clear();
        if (request.getPhones() != null) {
            for (ContactRequest.PhoneDto p : request.getPhones()) {
                ContactPhone phone = new ContactPhone();
                phone.setPhoneNumber(p.getPhoneNumber());
                phone.setLabel(p.getLabel());
                phone.setContact(existingContact);
                existingContact.getPhones().add(phone);
            }
        }

        Contact updated = contactRepository.save(existingContact);

        return ResponseEntity.ok(toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable Long id,
                                           @RequestHeader("Authorization") String authHeader) {
        User currentUser = getCurrentUser(authHeader);

        Contact existingContact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));

        if (!existingContact.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Access denied");
        }

        contactRepository.delete(existingContact);
        log.info("Contact deleted: {} by user id: {}", id, currentUser.getId());

        return ResponseEntity.ok(Map.of("message", "Contact deleted successfully"));
    }

    @GetMapping("/search")

        public ResponseEntity<?> searchContacts(@RequestParam String keyword,
                @RequestHeader("Authorization") String authHeader,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
            User currentUser = getCurrentUser(authHeader);
            size = Math.min(size, 50);
            Pageable pageable = PageRequest.of(page, size);

        Page<Contact> contactsPage = contactRepository.searchByKeyword(currentUser, keyword, pageable);

        List<ContactResponse> responses = contactsPage.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "contacts", responses,
                "currentPage", contactsPage.getNumber(),
                "totalItems", contactsPage.getTotalElements(),
                "totalPages", contactsPage.getTotalPages()
        ));
    }
}