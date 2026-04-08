package com.facturation_service.controller;

import com.facturation_service.dto.FactureRequestDTO;
import com.facturation_service.dto.FactureResponseDTO;
import com.facturation_service.service.FactureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/factures")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class FactureController {

    private final FactureService factureService;

    @PostMapping
    public ResponseEntity<FactureResponseDTO> create(@RequestBody FactureRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(factureService.createFacture(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FactureResponseDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(factureService.getFactureById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<FactureResponseDTO>> getByPatientId(@PathVariable Integer patientId) {
        return ResponseEntity.ok(factureService.getFacturesByPatientId(patientId));
    }

    @GetMapping
    public ResponseEntity<List<FactureResponseDTO>> getAll() {
        return ResponseEntity.ok(factureService.getAllFactures());
    }

    @PutMapping("/{id}")
    public ResponseEntity<FactureResponseDTO> update(@PathVariable Integer id, @RequestBody FactureRequestDTO request) {
        return ResponseEntity.ok(factureService.updateFacture(id, request));
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<FactureResponseDTO> updateStatut(@PathVariable Integer id, @RequestParam String statut) {
        return ResponseEntity.ok(factureService.updateStatut(id, statut));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        factureService.deleteFacture(id);
        return ResponseEntity.noContent().build();
    }
}