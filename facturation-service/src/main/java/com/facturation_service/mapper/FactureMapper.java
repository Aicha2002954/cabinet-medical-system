package com.facturation_service.mapper;

import com.facturation_service.dto.FactureRequestDTO;
import com.facturation_service.dto.FactureResponseDTO;
import com.facturation_service.entity.Facture;
import org.springframework.stereotype.Component;

@Component
public class FactureMapper {

    public Facture toEntity(FactureRequestDTO dto) {
        if (dto == null) return null;
        Facture entity = new Facture();
        entity.setConsultationId(dto.getConsultationId());
        entity.setPatientId(dto.getPatientId());
        entity.setMontant(dto.getMontant());
        if (dto.getStatut() != null) {
            entity.setStatut(Facture.Statut.valueOf(dto.getStatut()));
        } else {
            entity.setStatut(Facture.Statut.IMPAYEE);
        }
        entity.setDescription(dto.getDescription());
        return entity;
    }

    public FactureResponseDTO toDTO(Facture entity) {
        if (entity == null) return null;
        FactureResponseDTO dto = new FactureResponseDTO();
        dto.setId(entity.getId());
        dto.setConsultationId(entity.getConsultationId());
        dto.setPatientId(entity.getPatientId());
        dto.setMontant(entity.getMontant());
        dto.setStatut(entity.getStatut() != null ? entity.getStatut().name() : null);
        dto.setDateFacture(entity.getDateFacture());
        dto.setDescription(entity.getDescription());
        return dto;
    }
}