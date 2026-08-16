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

    private List<EmailDto> emails;
    private List<PhoneDto> phones;

    @Data
    public static class EmailDto {
        private String email;
        private String label;
    }

    @Data
    public static class PhoneDto {
        private String phoneNumber;
        private String label;
    }
}
