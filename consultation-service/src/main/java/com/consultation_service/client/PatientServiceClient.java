package com.consultation_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "PATIENT-SERVICE")
public interface PatientServiceClient {

    @GetMapping("/api/patients/{id}")
    Object getPatientById(@PathVariable("id") Integer id);
}