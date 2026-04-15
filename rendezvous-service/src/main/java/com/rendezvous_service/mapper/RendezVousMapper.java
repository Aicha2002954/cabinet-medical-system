package com.rendezvous_service.mapper;

import com.rendezvous_service.dto.RendezVousRequestDTO;
import com.rendezvous_service.dto.RendezVousResponseDTO;
import com.rendezvous_service.entity.RendezVous;
import org.springframework.stereotype.Component;

@Component
public class RendezVousMapper {

    public RendezVous toEntity(RendezVousRequestDTO dto) {
        if (dto == null) return null;
        RendezVous entity = new RendezVous();
        entity.setPatientId(dto.getPatientId());
        entity.setMedecinId(dto.getMedecinId());
        entity.setDateTime(dto.getDateTime());
        entity.setReason(dto.getReason());
        if (dto.getStatus() != null) {
            entity.setStatus(RendezVous.Status.valueOf(dto.getStatus()));
        } else {
            entity.setStatus(RendezVous.Status.EN_ATTENTE);
        }
        entity.setNotes(dto.getNotes());
        return entity;
    }

    public RendezVousResponseDTO toDTO(RendezVous entity) {
        if (entity == null) return null;
        RendezVousResponseDTO dto = new RendezVousResponseDTO();
        dto.setId(entity.getId());
        dto.setPatientId(entity.getPatientId());
        dto.setMedecinId(entity.getMedecinId());
        dto.setDateTime(entity.getDateTime());
        dto.setReason(entity.getReason());
        dto.setStatus(entity.getStatus() != null ? entity.getStatus().name() : null);
        dto.setNotes(entity.getNotes());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}