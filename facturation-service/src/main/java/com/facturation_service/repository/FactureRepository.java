package com.facturation_service.repository;

import com.facturation_service.entity.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FactureRepository extends JpaRepository<Facture, Integer> {
    List<Facture> findByPatientId(Integer patientId);
    List<Facture> findByStatut(Facture.Statut statut);
}