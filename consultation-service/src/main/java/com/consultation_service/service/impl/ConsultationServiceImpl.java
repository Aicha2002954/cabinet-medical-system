package com.consultation_service.service.impl;

import com.consultation_service.dto.ConsultationRequestDTO;
import com.consultation_service.dto.ConsultationResponseDTO;
import com.consultation_service.entity.Consultation;
import com.consultation_service.mapper.ConsultationMapper;
import com.consultation_service.repository.ConsultationRepository;
import com.consultation_service.service.ConsultationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConsultationServiceImpl implements ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final ConsultationMapper consultationMapper;

    @Override
    @Transactional
    public ConsultationResponseDTO createConsultation(ConsultationRequestDTO request) {
        Consultation consultation = consultationMapper.toEntity(request);
        consultation = consultationRepository.save(consultation);
        log.info("Consultation créée: {}", consultation.getId());
        return consultationMapper.toDTO(consultation);
    }

    @Override
    public ConsultationResponseDTO getConsultationById(Integer id) {
        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation non trouvée"));
        return consultationMapper.toDTO(consultation);
    }

    @Override
    public List<ConsultationResponseDTO> getConsultationsByPatientId(Integer patientId) {
        return consultationRepository.findByPatientId(patientId)
                .stream().map(consultationMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<ConsultationResponseDTO> getConsultationsByMedecinId(Integer medecinId) {
        return consultationRepository.findByMedecinId(medecinId)
                .stream().map(consultationMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<ConsultationResponseDTO> getAllConsultations() {
        return consultationRepository.findAll().stream()
                .map(consultationMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ConsultationResponseDTO updateConsultation(Integer id, ConsultationRequestDTO request) {
        Consultation existing = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation non trouvée"));
        existing.setPatientId(request.getPatientId());
        existing.setMedecinId(request.getMedecinId());
        existing.setRendezVousId(request.getRendezVousId());
        existing.setConsultationDate(request.getConsultationDate());
        existing.setDiagnostic(request.getDiagnostic());
        existing.setNotes(request.getNotes());
        existing.setPrescription(request.getPrescription());
        existing.setCertificatMedical(request.getCertificatMedical());
        if (request.getStatus() != null)
            existing.setStatus(Consultation.Status.valueOf(request.getStatus()));
        existing.setUpdatedAt(LocalDateTime.now());
        return consultationMapper.toDTO(consultationRepository.save(existing));
    }

    @Override
    @Transactional
    public ConsultationResponseDTO updateStatus(Integer id, String status) {
        Consultation existing = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation non trouvée"));
        existing.setStatus(Consultation.Status.valueOf(status));
        existing.setUpdatedAt(LocalDateTime.now());
        return consultationMapper.toDTO(consultationRepository.save(existing));
    }

    @Override
    @Transactional
    public void deleteConsultation(Integer id) {
        consultationRepository.deleteById(id);
    }
}