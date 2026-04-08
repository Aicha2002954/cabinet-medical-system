package com.consultation_service.mapper;

import com.consultation_service.dto.ConsultationRequestDTO;
import com.consultation_service.dto.ConsultationResponseDTO;
import com.consultation_service.entity.Consultation;
import org.springframework.stereotype.Component;

@Component
public class ConsultationMapper {

    public Consultation toEntity(ConsultationRequestDTO dto) {
        if (dto == null) return null;
        Consultation entity = new Consultation();
        entity.setPatientId(dto.getPatientId());
        entity.setMedecinId(dto.getMedecinId());
        entity.setRendezVousId(dto.getRendezVousId());
        entity.setConsultationDate(dto.getConsultationDate());
        entity.setDiagnostic(dto.getDiagnostic());
        entity.setNotes(dto.getNotes());
        entity.setPrescription(dto.getPrescription());
        entity.setCertificatMedical(dto.getCertificatMedical());
        if (dto.getStatus() != null) {
            entity.setStatus(Consultation.Status.valueOf(dto.getStatus()));
        } else {
            entity.setStatus(Consultation.Status.PLANIFIEE);
        }
        return entity;
    }

    public ConsultationResponseDTO toDTO(Consultation entity) {
        if (entity == null) return null;
        ConsultationResponseDTO dto = new ConsultationResponseDTO();
        dto.setId(entity.getId());
        dto.setPatientId(entity.getPatientId());
        dto.setMedecinId(entity.getMedecinId());
        dto.setRendezVousId(entity.getRendezVousId());
        dto.setConsultationDate(entity.getConsultationDate());
        dto.setDiagnostic(entity.getDiagnostic());
        dto.setNotes(entity.getNotes());
        dto.setPrescription(entity.getPrescription());
        dto.setCertificatMedical(entity.getCertificatMedical());
        dto.setStatus(entity.getStatus() != null ? entity.getStatus().name() : null);
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}