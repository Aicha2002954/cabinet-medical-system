package com.rendezvous_service;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.openfeign.EnableFeignClients;

import com.rendezvous_service.config.RsaKeys;

@SpringBootApplication
@EnableFeignClients
@EnableConfigurationProperties(RsaKeys.class)
public class RendezVousServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(RendezVousServiceApplication.class, args);
        System.out.println("✅ Rendez-vous Service démarré sur le port 8085");
    }
}