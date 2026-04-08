package com.rendezvous_service.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RendezVousRequestDTO {
    private Integer patientId;
    private Integer medecinId;
    private LocalDateTime dateTime;
    private String reason;
    private String status;  // EN_ATTENTE, CONFIRME, ANNULE, TERMINE
    private String notes;
}