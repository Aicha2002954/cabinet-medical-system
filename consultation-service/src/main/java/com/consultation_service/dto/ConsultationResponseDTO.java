package com.consultation_service.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationResponseDTO {
    private Integer id;
    private Integer patientId;
    private Integer medecinId;
    private Integer rendezVousId;
    private LocalDateTime consultationDate;
    private String diagnostic;
    private String notes;
    private String prescription;
    private String certificatMedical;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}