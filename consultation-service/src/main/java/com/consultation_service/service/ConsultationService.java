package com.consultation_service.service;

import com.consultation_service.dto.ConsultationRequestDTO;
import com.consultation_service.dto.ConsultationResponseDTO;
import java.util.List;

public interface ConsultationService {
    ConsultationResponseDTO createConsultation(ConsultationRequestDTO request);
    ConsultationResponseDTO getConsultationById(Integer id);
    List<ConsultationResponseDTO> getConsultationsByPatientId(Integer patientId);
    List<ConsultationResponseDTO> getConsultationsByMedecinId(Integer medecinId);
    List<ConsultationResponseDTO> getAllConsultations();
    ConsultationResponseDTO updateConsultation(Integer id, ConsultationRequestDTO request);
    ConsultationResponseDTO updateStatus(Integer id, String status);
    void deleteConsultation(Integer id);
}