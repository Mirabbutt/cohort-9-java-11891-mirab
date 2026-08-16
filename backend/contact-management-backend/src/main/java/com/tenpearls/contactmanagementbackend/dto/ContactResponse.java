package com.tenpearls.contactmanagementbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String title;
    private List<ContactRequest.EmailDto> emails;
    private List<ContactRequest.PhoneDto> phones;
}
