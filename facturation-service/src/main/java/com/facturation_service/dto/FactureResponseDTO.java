package com.facturation_service.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FactureResponseDTO {
    private Integer id;
    private Integer consultationId;
    private Integer patientId;
    private Double montant;
    private String statut;
    private LocalDateTime dateFacture;
    private String description;
}