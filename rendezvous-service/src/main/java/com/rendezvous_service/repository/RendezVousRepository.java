package com.rendezvous_service.repository;

import com.rendezvous_service.entity.RendezVous;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RendezVousRepository extends JpaRepository<RendezVous, Integer> {
    List<RendezVous> findByPatientId(Integer patientId);
    List<RendezVous> findByMedecinId(Integer medecinId);
}