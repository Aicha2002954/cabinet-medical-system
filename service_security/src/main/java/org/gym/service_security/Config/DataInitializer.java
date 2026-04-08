package org.gym.service_security.Config;

import org.gym.service_security.entities.Role;
import org.gym.service_security.entities.User;
import org.gym.service_security.repository.RoleRepository;
import org.gym.service_security.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            System.out.println("🚀 Initialisation des rôles Cabinet Médical...");

            List<String> roles = Arrays.asList(
                    "ADMIN",
                    "MEDECIN",
                    "SECRETAIRE",
                    "PATIENT"
            );

            // 🔹 Création des rôles
            for (String roleName : roles) {
                if (roleRepository.findByName(roleName).isEmpty()) {
                    Role role = new Role();
                    role.setName(roleName);
                    role.setDescription("ROLE_" + roleName);
                    roleRepository.save(role);
                    System.out.println("✅ Rôle créé : " + roleName);
                }
            }

            // 👑 ADMIN
            if (userRepository.findByEmail("admin@cabinet.com").isEmpty()) {

                User admin = new User();
                admin.setFirstName("Super");
                admin.setLastName("Admin");
                admin.setEmail("admin@cabinet.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setActive(true);

                Role adminRole = roleRepository.findByName("ADMIN")
                        .orElseThrow(() -> new RuntimeException("Role ADMIN introuvable"));

                admin.getRoles().add(adminRole);

                userRepository.save(admin);

                System.out.println("👑 Admin créé: admin@cabinet.com / admin123");
            }

            // 📋 SECRETAIRE
            if (userRepository.findByEmail("secretaire@cabinet.com").isEmpty()) {

                User secretaire = new User();
                secretaire.setFirstName("Sara");
                secretaire.setLastName("Secretaire");
                secretaire.setEmail("secretaire@cabinet.com");
                secretaire.setPassword(passwordEncoder.encode("123456"));
                secretaire.setActive(true);

                Role role = roleRepository.findByName("SECRETAIRE")
                        .orElseThrow(() -> new RuntimeException("Role SECRETAIRE introuvable"));

                secretaire.getRoles().add(role);

                userRepository.save(secretaire);

                System.out.println("📋 Secretaire créé");
            }

            // 🩺 MEDECIN
            if (userRepository.findByEmail("medecin@cabinet.com").isEmpty()) {

                User medecin = new User();
                medecin.setFirstName("Dr");
                medecin.setLastName("Hassan");
                medecin.setEmail("medecin@cabinet.com");
                medecin.setPassword(passwordEncoder.encode("123456"));
                medecin.setActive(true);

                Role role = roleRepository.findByName("MEDECIN")
                        .orElseThrow(() -> new RuntimeException("Role MEDECIN introuvable"));

                medecin.getRoles().add(role);

                userRepository.save(medecin);

                System.out.println("🩺 Medecin créé");
            }

            // 🧑‍⚕️ PATIENT
            if (userRepository.findByEmail("patient@cabinet.com").isEmpty()) {

                User patient = new User();
                patient.setFirstName("Ali");
                patient.setLastName("Patient");
                patient.setEmail("patient@cabinet.com");
                patient.setPassword(passwordEncoder.encode("123456"));
                patient.setActive(true);

                Role role = roleRepository.findByName("PATIENT")
                        .orElseThrow(() -> new RuntimeException("Role PATIENT introuvable"));

                patient.getRoles().add(role);

                userRepository.save(patient);

                System.out.println("🧑‍⚕️ Patient créé");
            }

            System.out.println("✅ Initialisation terminée !");
        };
    }
}