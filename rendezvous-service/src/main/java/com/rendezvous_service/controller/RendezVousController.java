package com.rendezvous_service.controller;

import com.rendezvous_service.dto.RendezVousRequestDTO;
import com.rendezvous_service.dto.RendezVousResponseDTO;
import com.rendezvous_service.service.RendezVousService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rendezvous")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class RendezVousController {

    private final RendezVousService rendezVousService;

    @PostMapping
    public ResponseEntity<RendezVousResponseDTO> create(@RequestBody RendezVousRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(rendezVousService.createRendezVous(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RendezVousResponseDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(rendezVousService.getRendezVousById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<RendezVousResponseDTO>> getByPatientId(@PathVariable Integer patientId) {
        return ResponseEntity.ok(rendezVousService.getRendezVousByPatientId(patientId));
    }

    @GetMapping("/medecin/{medecinId}")
    public ResponseEntity<List<RendezVousResponseDTO>> getByMedecinId(@PathVariable Integer medecinId) {
        return ResponseEntity.ok(rendezVousService.getRendezVousByMedecinId(medecinId));
    }

    @GetMapping
    public ResponseEntity<List<RendezVousResponseDTO>> getAll() {
        return ResponseEntity.ok(rendezVousService.getAllRendezVous());
    }

    @PutMapping("/{id}")
    public ResponseEntity<RendezVousResponseDTO> update(@PathVariable Integer id, @RequestBody RendezVousRequestDTO request) {
        return ResponseEntity.ok(rendezVousService.updateRendezVous(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<RendezVousResponseDTO> updateStatus(@PathVariable Integer id, @RequestParam String status) {
        return ResponseEntity.ok(rendezVousService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        rendezVousService.deleteRendezVous(id);
        return ResponseEntity.noContent().build();
    }
}