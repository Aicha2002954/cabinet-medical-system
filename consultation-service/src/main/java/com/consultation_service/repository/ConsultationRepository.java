package com.consultation_service.repository;

import com.consultation_service.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConsultationRepository extends JpaRepository<Consultation, Integer> {
    List<Consultation> findByPatientId(Integer patientId);
    List<Consultation> findByMedecinId(Integer medecinId);
}