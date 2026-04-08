package com.patient_service.repository;

import com.patient_service.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer> {
    Optional<Patient> findByEmail(String email);
    Optional<Patient> findByCin(String cin);
    List<Patient> findByUserId(Integer userId);
    boolean existsByEmail(String email);
    boolean existsByCin(String cin);
}