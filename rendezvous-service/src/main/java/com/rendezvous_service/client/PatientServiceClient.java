package com.rendezvous_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", url = "http://localhost:8087")
public interface PatientServiceClient {

    @GetMapping("/api/profiles/{id}")
    Object getPatientById(@PathVariable("id") Integer id);
}