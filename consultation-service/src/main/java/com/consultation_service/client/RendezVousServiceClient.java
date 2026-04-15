package com.consultation_service.client;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "rendezvous-service", url = "http://localhost:8085")
public interface RendezVousServiceClient {

    @GetMapping("/api/rendezvous/{id}")
    Object getRendezVousById(@PathVariable("id") Integer id);
}