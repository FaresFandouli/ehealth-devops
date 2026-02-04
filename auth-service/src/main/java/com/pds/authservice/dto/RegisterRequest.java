package com.pds.authservice.dto;

import com.pds.authservice.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @Email(message = "Email invalide")
    @NotBlank(message = "Email requis")
    private String email;

    @NotBlank(message = "Prénom requis")
    private String firstName;

    @NotBlank(message = "Nom requis")
    private String lastName;

    @NotNull(message = "Rôle requis")
    private UserRole role; // PATIENT, DOCTOR, ADMIN

    private String phone;
    private String address;
    private String city;
    private String zipCode;
    private String dateOfBirth;
    private String gender;
}
