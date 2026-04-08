package org.delivery.users_service.DTO;


import org.delivery.users_service.entities.RoleType;

import lombok.Data;

@Data
public class UserResponseDTO {
    private Integer userId;
        private String firstName;
        private String lastName;
        private String email;
        private String password;
        private String phone; // خاص تكون phone ماشي phoneNumber باش تفهمها React
        private String cni;
        private String zone;  // خاص تكون zone ماشي city
        private String address;
        private RoleType role;
 
    // في UserProfile.java
    private String profileImageUrl;
  
        // Getters and Setters...
    }
