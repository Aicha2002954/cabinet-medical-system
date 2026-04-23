package org.gym.service_security.services;


import org.gym.service_security.dto.UserRequestDTO;
import org.gym.service_security.dto.UserResponseDTO;
import org.gym.service_security.entities.User;
import java.util.List;

public interface UserService {
    UserResponseDTO createUser(UserRequestDTO request);
    UserResponseDTO getUserById(Integer id);
    List<UserResponseDTO> getAllUsers();
    void deleteUser(Integer id);
    UserResponseDTO assignRoleToUser(Integer userId, String roleName);
    UserResponseDTO updateUserStatus(Integer id, Boolean active);
    UserResponseDTO updateUser(Integer id, UserRequestDTO request);
    List<User> getAllMedecins();
    List<User> getAllPatients();
}