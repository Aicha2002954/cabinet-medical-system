package org.delivery.users_service.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.delivery.users_service.DTO.UserRequestDTO;
import org.delivery.users_service.DTO.UserResponseDTO;
import org.delivery.users_service.service.UserProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/profiles")
public class UserProfileController {

    private final UserProfileService profileService;

    public UserProfileController(UserProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> create(@RequestBody UserRequestDTO request) {
        System.out.println("DEBUG: Entering CREATE method for email: " + request.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(profileService.createUserProfile(request));
    }

    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<UserResponseDTO> update(
            @PathVariable Integer id,
            @ModelAttribute UserRequestDTO request,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        System.out.println("DEBUG: Updating profile for ID: " + id);
        return ResponseEntity.ok(profileService.updateUserProfile(id, request, file));
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAll() {
        return ResponseEntity.ok(profileService.getAllProfiles());
    }

    // هذا هو الـ endpoint الجديد (لجلب المستخدم بواسطة ID مباشر)
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(profileService.getUserProfile(id));
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<UserResponseDTO> getDetails(@PathVariable Integer id) {
        return ResponseEntity.ok(profileService.getUserProfile(id));
    }
@PreAuthorize("hasRole('ADMIN') or hasRole('SECRETAIRE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        profileService.deleteProfile(id);
        return ResponseEntity.noContent().build();
    }
}