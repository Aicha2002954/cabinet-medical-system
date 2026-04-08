package com.patient_service.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientRequestDTO {
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
}