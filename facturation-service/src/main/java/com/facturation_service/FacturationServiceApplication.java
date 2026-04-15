package com.facturation_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.openfeign.EnableFeignClients;

import com.facturation_service.config.RsaKeys;

@SpringBootApplication
@EnableFeignClients
@EnableConfigurationProperties(RsaKeys.class)
public class FacturationServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(FacturationServiceApplication.class, args);
        System.out.println("✅ Facturation Service démarré sur le port 8086");
    }
}