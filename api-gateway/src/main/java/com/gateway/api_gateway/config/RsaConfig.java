package com.gateway.api_gateway.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import java.security.interfaces.RSAPublicKey;

@ConfigurationProperties(prefix = "rsa")
public record RsaConfig(RSAPublicKey publicKey) {
}