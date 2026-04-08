package com.patient_service.service.impl;

import com.patient_service.dto.PatientRequestDTO;
import com.patient_service.dto.PatientResponseDTO;
import com.patient_service.entity.Patient;
import com.patient_service.mapper.PatientMapper;
import com.patient_service.repository.PatientRepository;
import com.patient_service.service.PatientService;
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
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;

    @Override
    @Transactional
    public PatientResponseDTO createPatient(PatientRequestDTO request) {
        if (patientRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Patient avec cet email existe déjà");
        }

        if (request.getCin() != null && patientRepository.existsByCin(request.getCin())) {
            throw new RuntimeException("Patient avec ce CIN existe déjà");
        }

        Patient patient = patientMapper.toEntity(request);
        patient = patientRepository.save(patient);

        log.info("Patient créé avec succès: {}", patient.getEmail());
        return patientMapper.toDTO(patient);
    }

    @Override
    public PatientResponseDTO getPatientById(Integer id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec ID: " + id));
        return patientMapper.toDTO(patient);
    }

    @Override
    public PatientResponseDTO getPatientByUserId(Integer userId) {
        List<Patient> patients = patientRepository.findByUserId(userId);
        if (patients.isEmpty()) {
            throw new RuntimeException("Aucun patient trouvé pour userId: " + userId);
        }
        return patientMapper.toDTO(patients.get(0));
    }

    @Override
    public List<PatientResponseDTO> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(patientMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PatientResponseDTO updatePatient(Integer id, PatientRequestDTO request) {
        Patient existingPatient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec ID: " + id));

        existingPatient.setFirstName(request.getFirstName());
        existingPatient.setLastName(request.getLastName());
        existingPatient.setEmail(request.getEmail());
        existingPatient.setPhone(request.getPhone());
        existingPatient.setCin(request.getCin());
        existingPatient.setBirthDate(request.getBirthDate());
        existingPatient.setAddress(request.getAddress());
        existingPatient.setBloodType(request.getBloodType());
        existingPatient.setAllergies(request.getAllergies());
        existingPatient.setMedicalHistory(request.getMedicalHistory());
        existingPatient.setUpdatedAt(LocalDateTime.now());

        Patient updatedPatient = patientRepository.save(existingPatient);
        log.info("Patient mis à jour: {}", updatedPatient.getEmail());

        return patientMapper.toDTO(updatedPatient);
    }

    @Override
    @Transactional
    public void deletePatient(Integer id) {
        if (!patientRepository.existsById(id)) {
            throw new RuntimeException("Patient non trouvé avec ID: " + id);
        }
        patientRepository.deleteById(id);
        log.info("Patient supprimé avec ID: {}", id);
    }
}