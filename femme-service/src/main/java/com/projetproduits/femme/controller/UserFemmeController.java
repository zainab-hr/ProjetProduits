package com.projetproduits.femme.controller;

import com.projetproduits.femme.dto.ApiResponse;
import com.projetproduits.femme.dto.UserFemmeDto;
import com.projetproduits.femme.service.UserFemmeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserFemmeController {

    private final UserFemmeService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserFemmeDto>>> getAllUsers() {
        log.info("GET /users - Fetching all users");
        List<UserFemmeDto> users = userService.findAll();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserFemmeDto>> getUserById(@PathVariable Long id) {
        log.info("GET /users/{} - Fetching user by id", id);
        UserFemmeDto user = userService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<UserFemmeDto>> getUserByEmail(@PathVariable String email) {
        log.info("GET /users/email/{} - Fetching user by email", email);
        UserFemmeDto user = userService.findByEmail(email);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<UserFemmeDto>>> searchUsers(@RequestParam String nom) {
        log.info("GET /users/search?nom={} - Searching users", nom);
        List<UserFemmeDto> users = userService.searchByNom(nom);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/age-range")
    public ResponseEntity<ApiResponse<List<UserFemmeDto>>> getUsersByAgeRange(
            @RequestParam Integer minAge,
            @RequestParam Integer maxAge) {
        log.info("GET /users/age-range?minAge={}&maxAge={} - Fetching users by age range", minAge, maxAge);
        List<UserFemmeDto> users = userService.findByAgeRange(minAge, maxAge);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserFemmeDto>> createUser(@Valid @RequestBody UserFemmeDto dto) {
        log.info("POST /users - Creating new user: {}", dto.getEmail());
        UserFemmeDto created = userService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserFemmeDto>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserFemmeDto dto) {
        log.info("PUT /users/{} - Updating user", id);
        UserFemmeDto updated = userService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        log.info("DELETE /users/{} - Deleting user", id);
        userService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }
}
