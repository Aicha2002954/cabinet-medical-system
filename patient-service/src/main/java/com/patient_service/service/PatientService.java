package com.patient_service.service;

import com.patient_service.dto.PatientRequestDTO;
import com.patient_service.dto.PatientResponseDTO;
import java.util.List;

public interface PatientService {
    PatientResponseDTO createPatient(PatientRequestDTO request);
    PatientResponseDTO getPatientById(Integer id);
    PatientResponseDTO getPatientByUserId(Integer userId);
    List<PatientResponseDTO> getAllPatients();
    PatientResponseDTO updatePatient(Integer id, PatientRequestDTO request);
    void deletePatient(Integer id);
}