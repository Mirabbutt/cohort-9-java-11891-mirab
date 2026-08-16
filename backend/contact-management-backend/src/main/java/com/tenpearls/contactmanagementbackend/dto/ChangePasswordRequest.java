package com.tenpearls.contactmanagementbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.ToString;

@Data
public class ChangePasswordRequest {

    @NotBlank(message = "Old password is required")
    @ToString.Exclude
    private String oldPassword;

    @NotBlank(message = "New password is required")
    @Size(min = 6, message = "New password must be at least 6 characters")
    @ToString.Exclude
    private String newPassword;


}
