package com.patient_service.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponseDTO {
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String cin;
    private LocalDate birthDate;
    private String address;
    private String bloodType;
    private String allergies;
    private String medicalHistory;
    private Integer userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}