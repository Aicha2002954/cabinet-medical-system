package com.patient_service.controller;

import com.patient_service.dto.PatientRequestDTO;
import com.patient_service.dto.PatientResponseDTO;
import com.patient_service.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;  // علّقي هاد الـ import مؤقتاً
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PatientController {

    private final PatientService patientService;

    @PostMapping
    // @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETAIRE')")  // معلق
    public ResponseEntity<PatientResponseDTO> createPatient(@RequestBody PatientRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(patientService.createPatient(request));
    }

    @GetMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETAIRE') or hasRole('MEDECIN')")  // معلق
    public ResponseEntity<PatientResponseDTO> getPatientById(@PathVariable Integer id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @GetMapping("/user/{userId}")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETAIRE') or hasRole('MEDECIN')")  // معلق
    public ResponseEntity<PatientResponseDTO> getPatientByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(patientService.getPatientByUserId(userId));
    }

    @GetMapping
    // @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETAIRE') or hasRole('MEDECIN')")  // معلق
    public ResponseEntity<List<PatientResponseDTO>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @PutMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETAIRE')")  // معلق
    public ResponseEntity<PatientResponseDTO> updatePatient(@PathVariable Integer id, @RequestBody PatientRequestDTO request) {
        return ResponseEntity.ok(patientService.updatePatient(id, request));
    }

    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")  // معلق
    public ResponseEntity<Void> deletePatient(@PathVariable Integer id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }
}