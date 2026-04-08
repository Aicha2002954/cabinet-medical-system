package com.consultation_service.controller;

import com.consultation_service.dto.ConsultationRequestDTO;
import com.consultation_service.dto.ConsultationResponseDTO;
import com.consultation_service.service.ConsultationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ConsultationController {

    private final ConsultationService consultationService;

    @PostMapping
    public ResponseEntity<ConsultationResponseDTO> create(@RequestBody ConsultationRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(consultationService.createConsultation(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsultationResponseDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(consultationService.getConsultationById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<ConsultationResponseDTO>> getByPatientId(@PathVariable Integer patientId) {
        return ResponseEntity.ok(consultationService.getConsultationsByPatientId(patientId));
    }

    @GetMapping("/medecin/{medecinId}")
    public ResponseEntity<List<ConsultationResponseDTO>> getByMedecinId(@PathVariable Integer medecinId) {
        return ResponseEntity.ok(consultationService.getConsultationsByMedecinId(medecinId));
    }

    @GetMapping
    public ResponseEntity<List<ConsultationResponseDTO>> getAll() {
        return ResponseEntity.ok(consultationService.getAllConsultations());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConsultationResponseDTO> update(@PathVariable Integer id, @RequestBody ConsultationRequestDTO request) {
        return ResponseEntity.ok(consultationService.updateConsultation(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ConsultationResponseDTO> updateStatus(@PathVariable Integer id, @RequestParam String status) {
        return ResponseEntity.ok(consultationService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        consultationService.deleteConsultation(id);
        return ResponseEntity.noContent().build();
    }
}