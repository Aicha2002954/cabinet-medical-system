package com.rendezvous_service.service.impl;

import com.rendezvous_service.client.PatientServiceClient;
import com.rendezvous_service.dto.RendezVousRequestDTO;
import com.rendezvous_service.dto.RendezVousResponseDTO;
import com.rendezvous_service.entity.RendezVous;
import com.rendezvous_service.mapper.RendezVousMapper;
import com.rendezvous_service.repository.RendezVousRepository;
import com.rendezvous_service.service.RendezVousService;
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
public class RendezVousServiceImpl implements RendezVousService {

    private final RendezVousRepository rendezVousRepository;
    private final RendezVousMapper rendezVousMapper;
    private final PatientServiceClient patientServiceClient;  // Feign Client لـ Patient Service (اختياري الآن)

    @Override
    @Transactional
    public RendezVousResponseDTO createRendezVous(RendezVousRequestDTO request) {
        // تعطيل التحقق من وجود المريض في patient-service
        // لأن المرضى موجودون في خدمة المستخدمين (profiles) وليس في patient-service
        /*
        try {
            Object patient = patientServiceClient.getPatientById(request.getPatientId());
            if (patient == null) {
                throw new RuntimeException("Patient non trouvé avec ID: " + request.getPatientId());
            }
            log.info("Patient trouvé: {}", patient);
        } catch (Exception e) {
            log.error("Erreur lors de la vérification du patient: {}", e.getMessage());
            throw new RuntimeException("Impossible de vérifier le patient. Erreur: " + e.getMessage());
        }
        */

        // إنشاء الموعد مباشرة بدون التحقق
        RendezVous rdv = rendezVousMapper.toEntity(request);
        rdv = rendezVousRepository.save(rdv);
        log.info("Rendez-vous créé avec succès, ID: {}", rdv.getId());
        return rendezVousMapper.toDTO(rdv);
    }

    @Override
    public RendezVousResponseDTO getRendezVousById(Integer id) {
        RendezVous rdv = rendezVousRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé avec ID: " + id));
        return rendezVousMapper.toDTO(rdv);
    }

    @Override
    public List<RendezVousResponseDTO> getRendezVousByPatientId(Integer patientId) {
        return rendezVousRepository.findByPatientId(patientId)
                .stream()
                .map(rendezVousMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RendezVousResponseDTO> getRendezVousByMedecinId(Integer medecinId) {
        return rendezVousRepository.findByMedecinId(medecinId)
                .stream()
                .map(rendezVousMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RendezVousResponseDTO> getAllRendezVous() {
        return rendezVousRepository.findAll()
                .stream()
                .map(rendezVousMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RendezVousResponseDTO updateRendezVous(Integer id, RendezVousRequestDTO request) {
        RendezVous existing = rendezVousRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé avec ID: " + id));
        existing.setPatientId(request.getPatientId());
        existing.setMedecinId(request.getMedecinId());
        existing.setDateTime(request.getDateTime());
        existing.setReason(request.getReason());
        if (request.getStatus() != null) {
            existing.setStatus(RendezVous.Status.valueOf(request.getStatus()));
        }
        existing.setNotes(request.getNotes());
        existing.setUpdatedAt(LocalDateTime.now());
        return rendezVousMapper.toDTO(rendezVousRepository.save(existing));
    }

    @Override
    @Transactional
    public RendezVousResponseDTO updateStatus(Integer id, String status) {
        RendezVous existing = rendezVousRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé avec ID: " + id));
        existing.setStatus(RendezVous.Status.valueOf(status));
        existing.setUpdatedAt(LocalDateTime.now());
        return rendezVousMapper.toDTO(rendezVousRepository.save(existing));
    }

    @Override
    @Transactional
    public void deleteRendezVous(Integer id) {
        if (!rendezVousRepository.existsById(id)) {
            throw new RuntimeException("Rendez-vous non trouvé avec ID: " + id);
        }
        rendezVousRepository.deleteById(id);
        log.info("Rendez-vous supprimé: {}", id);
    }
}