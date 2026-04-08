package com.rendezvous_service.repository;

import com.rendezvous_service.entity.RendezVous;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RendezVousRepository extends JpaRepository<RendezVous, Integer> {
    List<RendezVous> findByPatientId(Integer patientId);
    List<RendezVous> findByMedecinId(Integer medecinId);
    List<RendezVous> findByStatus(RendezVous.Status status);
    List<RendezVous> findByMedecinIdAndDateTimeBetween(Integer medecinId, LocalDateTime start, LocalDateTime end);
}