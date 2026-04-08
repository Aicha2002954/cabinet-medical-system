package com.rendezvous_service.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rsa")
public record RsaKeys(String publicKey) {   // <- تغيير RSAPublicKey إلى String
}