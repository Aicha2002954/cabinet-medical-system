package com.facturation_service.service;

import com.facturation_service.dto.FactureRequestDTO;
import com.facturation_service.dto.FactureResponseDTO;
import java.util.List;

public interface FactureService {
    FactureResponseDTO createFacture(FactureRequestDTO request);
    FactureResponseDTO getFactureById(Integer id);
    List<FactureResponseDTO> getFacturesByPatientId(Integer patientId);
    List<FactureResponseDTO> getAllFactures();
    FactureResponseDTO updateFacture(Integer id, FactureRequestDTO request);
    FactureResponseDTO updateStatut(Integer id, String statut);
    void deleteFacture(Integer id);
}