package com.consultation_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.openfeign.EnableFeignClients;

import com.consultation_service.config.RsaKeys;

@SpringBootApplication
@EnableFeignClients
@EnableConfigurationProperties(RsaKeys.class)
public class ConsultationServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConsultationServiceApplication.class, args);
        System.out.println("✅ Consultation Service démarré sur le port 8084");
    }
}