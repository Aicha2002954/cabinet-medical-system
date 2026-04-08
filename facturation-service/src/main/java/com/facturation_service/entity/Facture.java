package com.facturation_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "factures")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer consultationId;
    private Integer patientId;
    private Double montant;

    @Enumerated(EnumType.STRING)
    private Statut statut;

    private LocalDateTime dateFacture = LocalDateTime.now();
    private String description;

    public enum Statut {
        PAYEE, IMPAYEE, ANNULEE
    }
}