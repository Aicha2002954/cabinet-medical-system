package com.consultation_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "consultations")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer patientId;
    private Integer medecinId;
    private Integer rendezVousId;
    private LocalDateTime consultationDate;
    private String diagnostic;
    private String notes;
    private String prescription;
    private String certificatMedical;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    public enum Status {
        PLANIFIEE, EN_COURS, TERMINEE, ANNULEE
    }
}