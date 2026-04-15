package com.rendezvous_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rendez_vous")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class RendezVous {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Integer patientId;

    @Column(nullable = false)
    private Integer medecinId;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    private String reason;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String notes;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    public enum Status {
        EN_ATTENTE, CONFIRME, ANNULE, TERMINE
    }
}