package com.projetproduits.index.controller;

import com.projetproduits.index.dto.*;
import com.projetproduits.index.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public Mono<ResponseEntity<ApiResponse<AuthResponse>>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration request for username: {}", request.getUsername());
        return authService.register(request)
                .map(response -> ResponseEntity
                        .status(HttpStatus.CREATED)
                        .body(ApiResponse.success("User registered successfully", response)));
    }

    @PostMapping("/login")
    public Mono<ResponseEntity<ApiResponse<AuthResponse>>> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request for username: {}", request.getUsername());
        return authService.login(request)
                .map(response -> ResponseEntity.ok(ApiResponse.success("Login successful", response)));
    }

    @PostMapping("/refresh")
    public Mono<ResponseEntity<ApiResponse<AuthResponse>>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Refresh token request");
        return authService.refreshToken(request)
                .map(response -> ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response)));
    }

    @PostMapping("/logout")
    public Mono<ResponseEntity<ApiResponse<Void>>> logout(@RequestBody RefreshTokenRequest request) {
        log.info("Logout request");
        return authService.logout(request.getRefreshToken())
                .then(Mono.just(ResponseEntity.ok(ApiResponse.<Void>success("Logged out successfully", null))));
    }

    @GetMapping("/validate")
    public Mono<ResponseEntity<ApiResponse<String>>> validateToken() {
        return Mono.just(ResponseEntity.ok(ApiResponse.success("Token is valid", "Valid")));
    }

    @DeleteMapping("/users/username/{username}")
    public Mono<ResponseEntity<ApiResponse<Void>>> deleteUserByUsername(@PathVariable String username) {
        log.info("Delete user request for username: {}", username);
        return authService.deleteUserByUsername(username)
                .then(Mono.just(ResponseEntity.ok(ApiResponse.<Void>success("User deleted successfully", null))));
    }

    @DeleteMapping("/users/email/{email}")
    public Mono<ResponseEntity<ApiResponse<Void>>> deleteUserByEmail(@PathVariable String email) {
        log.info("Delete user request for email: {}", email);
        return authService.deleteUserByEmail(email)
                .then(Mono.just(ResponseEntity.ok(ApiResponse.<Void>success("User deleted successfully", null))));
    }
}
