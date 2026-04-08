package com.patient_service.mapper;

import com.patient_service.dto.PatientRequestDTO;
import com.patient_service.dto.PatientResponseDTO;
import com.patient_service.entity.Patient;
import org.springframework.stereotype.Component;

@Component
public class PatientMapper {

    public Patient toEntity(PatientRequestDTO dto) {
        if (dto == null) return null;

        Patient patient = new Patient();
        patient.setFirstName(dto.getFirstName());
        patient.setLastName(dto.getLastName());
        patient.setEmail(dto.getEmail());
        patient.setPhone(dto.getPhone());
        patient.setCin(dto.getCin());
        patient.setBirthDate(dto.getBirthDate());
        patient.setAddress(dto.getAddress());
        patient.setBloodType(dto.getBloodType());
        patient.setAllergies(dto.getAllergies());
        patient.setMedicalHistory(dto.getMedicalHistory());
        patient.setUserId(dto.getUserId());

        return patient;
    }

    public PatientResponseDTO toDTO(Patient entity) {
        if (entity == null) return null;

        PatientResponseDTO dto = new PatientResponseDTO();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        dto.setCin(entity.getCin());
        dto.setBirthDate(entity.getBirthDate());
        dto.setAddress(entity.getAddress());
        dto.setBloodType(entity.getBloodType());
        dto.setAllergies(entity.getAllergies());
        dto.setMedicalHistory(entity.getMedicalHistory());
        dto.setUserId(entity.getUserId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        return dto;
    }
}