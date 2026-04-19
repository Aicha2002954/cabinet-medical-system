package org.delivery.users_service.entities;

import jakarta.persistence.*;

import lombok.*;
@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor

public class UserProfile {
    @Id
    private Integer userId;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phone; 
    private String cni;
    private String zone; 
    private String address;
    // في UserProfile.java
    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    private RoleType role;
}