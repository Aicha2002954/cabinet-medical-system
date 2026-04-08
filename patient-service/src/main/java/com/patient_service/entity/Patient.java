package com.patient_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;

    @Column(unique = true)
    private String cin;

    private LocalDate birthDate;

    private String address;

    private String bloodType;

    private String allergies;

    private String medicalHistory;

    @Column(nullable = false)
    private Integer userId;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;
}