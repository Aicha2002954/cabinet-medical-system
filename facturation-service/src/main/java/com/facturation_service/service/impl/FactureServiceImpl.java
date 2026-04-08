package com.facturation_service.service.impl;

import com.facturation_service.dto.FactureRequestDTO;
import com.facturation_service.dto.FactureResponseDTO;
import com.facturation_service.entity.Facture;
import com.facturation_service.mapper.FactureMapper;
import com.facturation_service.repository.FactureRepository;
import com.facturation_service.service.FactureService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FactureServiceImpl implements FactureService {

    private final FactureRepository factureRepository;
    private final FactureMapper factureMapper;

    @Override
    @Transactional
    public FactureResponseDTO createFacture(FactureRequestDTO request) {
        Facture facture = factureMapper.toEntity(request);
        facture = factureRepository.save(facture);
        log.info("Facture créée: {}", facture.getId());
        return factureMapper.toDTO(facture);
    }

    @Override
    public FactureResponseDTO getFactureById(Integer id) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture non trouvée"));
        return factureMapper.toDTO(facture);
    }

    @Override
    public List<FactureResponseDTO> getFacturesByPatientId(Integer patientId) {
        return factureRepository.findByPatientId(patientId)
                .stream().map(factureMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<FactureResponseDTO> getAllFactures() {
        return factureRepository.findAll().stream()
                .map(factureMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FactureResponseDTO updateFacture(Integer id, FactureRequestDTO request) {
        Facture existing = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture non trouvée"));
        existing.setConsultationId(request.getConsultationId());
        existing.setPatientId(request.getPatientId());
        existing.setMontant(request.getMontant());
        if (request.getStatut() != null) {
            existing.setStatut(Facture.Statut.valueOf(request.getStatut()));
        }
        existing.setDescription(request.getDescription());
        return factureMapper.toDTO(factureRepository.save(existing));
    }

    @Override
    @Transactional
    public FactureResponseDTO updateStatut(Integer id, String statut) {
        Facture existing = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture non trouvée"));
        existing.setStatut(Facture.Statut.valueOf(statut));
        return factureMapper.toDTO(factureRepository.save(existing));
    }

    @Override
    @Transactional
    public void deleteFacture(Integer id) {
        factureRepository.deleteById(id);
        log.info("Facture supprimée: {}", id);
    }
}