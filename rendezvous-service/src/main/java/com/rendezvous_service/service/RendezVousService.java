package com.rendezvous_service.service;

import com.rendezvous_service.dto.RendezVousRequestDTO;
import com.rendezvous_service.dto.RendezVousResponseDTO;
import java.util.List;

public interface RendezVousService {
    RendezVousResponseDTO createRendezVous(RendezVousRequestDTO request);
    RendezVousResponseDTO getRendezVousById(Integer id);
    List<RendezVousResponseDTO> getRendezVousByPatientId(Integer patientId);
    List<RendezVousResponseDTO> getRendezVousByMedecinId(Integer medecinId);
    List<RendezVousResponseDTO> getAllRendezVous();
    RendezVousResponseDTO updateRendezVous(Integer id, RendezVousRequestDTO request);
    RendezVousResponseDTO updateStatus(Integer id, String status);
    void deleteRendezVous(Integer id);
}