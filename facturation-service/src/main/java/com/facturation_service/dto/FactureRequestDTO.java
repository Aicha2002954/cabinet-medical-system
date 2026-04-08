package com.facturation_service.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FactureRequestDTO {
    private Integer consultationId;
    private Integer patientId;
    private Double montant;
    private String statut;   // PAYEE, IMPAYEE, ANNULEE
    private String description;
}