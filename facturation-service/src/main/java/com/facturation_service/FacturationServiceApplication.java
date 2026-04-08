package com.facturation_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients

public class FacturationServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(FacturationServiceApplication.class, args);
        System.out.println("✅ Facturation Service démarré sur le port 8086");
    }
}