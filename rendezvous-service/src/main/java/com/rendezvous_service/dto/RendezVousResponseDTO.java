package com.rendezvous_service.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RendezVousResponseDTO {
    private Integer id;
    private Integer patientId;
    private Integer medecinId;
    private LocalDateTime dateTime;
    private String reason;
    private String status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}