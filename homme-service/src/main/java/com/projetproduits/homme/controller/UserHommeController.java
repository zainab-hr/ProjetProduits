package com.projetproduits.homme.controller;

import com.projetproduits.homme.dto.ApiResponse;
import com.projetproduits.homme.dto.UserHommeDto;
import com.projetproduits.homme.service.UserHommeService;
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
public class UserHommeController {

    private final UserHommeService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserHommeDto>>> getAllUsers() {
        log.info("GET /users - Fetching all users");
        List<UserHommeDto> users = userService.findAll();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserHommeDto>> getUserById(@PathVariable Long id) {
        log.info("GET /users/{} - Fetching user by id", id);
        UserHommeDto user = userService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<UserHommeDto>> getUserByEmail(@PathVariable String email) {
        log.info("GET /users/email/{} - Fetching user by email", email);
        UserHommeDto user = userService.findByEmail(email);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<UserHommeDto>>> searchUsers(@RequestParam String nom) {
        log.info("GET /users/search?nom={} - Searching users", nom);
        List<UserHommeDto> users = userService.searchByNom(nom);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/age-range")
    public ResponseEntity<ApiResponse<List<UserHommeDto>>> getUsersByAgeRange(
            @RequestParam Integer minAge,
            @RequestParam Integer maxAge) {
        log.info("GET /users/age-range?minAge={}&maxAge={} - Fetching users by age range", minAge, maxAge);
        List<UserHommeDto> users = userService.findByAgeRange(minAge, maxAge);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserHommeDto>> createUser(@Valid @RequestBody UserHommeDto dto) {
        log.info("POST /users - Creating new user: {}", dto.getEmail());
        UserHommeDto created = userService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserHommeDto>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserHommeDto dto) {
        log.info("PUT /users/{} - Updating user", id);
        UserHommeDto updated = userService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        log.info("DELETE /users/{} - Deleting user", id);
        userService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }
}
