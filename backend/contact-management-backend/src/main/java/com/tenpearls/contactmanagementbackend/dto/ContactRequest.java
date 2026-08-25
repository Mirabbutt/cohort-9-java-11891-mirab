package com.tenpearls.contactmanagementbackend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class ContactRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String title;

    @jakarta.validation.Valid
    private List<EmailDto> emails;

    @jakarta.validation.Valid
    private List<PhoneDto> phones;

    @Data
    public static class EmailDto {
        @jakarta.validation.constraints.NotBlank(message = "Email cannot be blank")
        private String email;
        private String label;
    }

    @Data
    public static class PhoneDto {
        @jakarta.validation.constraints.NotBlank(message = "Phone number cannot be blank")
        private String phoneNumber;
        private String label;
    }
}
