package com.projetproduits.index.service;

import com.projetproduits.index.dto.*;
import com.projetproduits.index.entity.Genre;
import com.projetproduits.index.entity.RefreshToken;
import com.projetproduits.index.entity.Role;
import com.projetproduits.index.entity.User;
import com.projetproduits.index.exception.InvalidCredentialsException;
import com.projetproduits.index.exception.TokenRefreshException;
import com.projetproduits.index.exception.UserAlreadyExistsException;
import com.projetproduits.index.repository.RefreshTokenRepository;
import com.projetproduits.index.repository.UserRepository;
import com.projetproduits.index.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserSyncService userSyncService;

    private static final long REFRESH_TOKEN_VALIDITY_DAYS = 7;

    public Mono<AuthResponse> register(RegisterRequest request) {
        return userRepository.existsByUsername(request.getUsername())
                .flatMap(existsByUsername -> {
                    if (existsByUsername) {
                        return Mono.error(new UserAlreadyExistsException("Username already exists"));
                    }
                    return userRepository.existsByEmail(request.getEmail());
                })
                .flatMap(existsByEmail -> {
                    if (existsByEmail) {
                        return Mono.error(new UserAlreadyExistsException("Email already exists"));
                    }
                    
                    User user = User.builder()
                            .username(request.getUsername())
                            .email(request.getEmail())
                            .password(passwordEncoder.encode(request.getPassword()))
                            .role(Role.USER)
                            .genre(Genre.valueOf(request.getGenre().toUpperCase()))
                            .enabled(true)
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build();
                    
                    return userRepository.save(user);
                })
                .flatMap(savedUser -> {
                    // Sync user to the appropriate genre-specific database (homme or femme)
                    return userSyncService.syncUserToGenreDatabase(
                            savedUser.getUsername(),
                            savedUser.getEmail(),
                            savedUser.getGenre().name()
                    ).then(generateAuthResponse(savedUser));
                });
    }

    public Mono<AuthResponse> login(LoginRequest request) {
        return userRepository.findByUsername(request.getUsername())
                .switchIfEmpty(Mono.error(new InvalidCredentialsException("Invalid username or password")))
                .flatMap(user -> {
                    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                        return Mono.error(new InvalidCredentialsException("Invalid username or password"));
                    }
                    if (!user.getEnabled()) {
                        return Mono.error(new InvalidCredentialsException("Account is disabled"));
                    }
                    return generateAuthResponse(user);
                });
    }

    public Mono<AuthResponse> refreshToken(RefreshTokenRequest request) {
        return refreshTokenRepository.findByToken(request.getRefreshToken())
                .switchIfEmpty(Mono.error(new TokenRefreshException("Invalid refresh token")))
                .flatMap(token -> {
                    if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
                        return refreshTokenRepository.delete(token)
                                .then(Mono.error(new TokenRefreshException("Refresh token has expired")));
                    }
                    return userRepository.findById(token.getUserId());
                })
                .flatMap(user -> {
                    // Delete old refresh token and generate new tokens
                    return refreshTokenRepository.deleteByUserId(user.getId())
                            .then(generateAuthResponse(user));
                });
    }

    public Mono<Void> logout(String refreshToken) {
        return refreshTokenRepository.deleteByToken(refreshToken);
    }

    public Mono<Void> deleteUserByUsername(String username) {
        log.info("Deleting user with username: {}", username);
        return userRepository.findByUsername(username)
                .flatMap(user -> {
                    return refreshTokenRepository.deleteByUserId(user.getId())
                            .then(userRepository.delete(user));
                })
                .doOnSuccess(v -> log.info("User {} deleted successfully", username));
    }

    public Mono<Void> deleteUserByEmail(String email) {
        log.info("Deleting user with email: {}", email);
        return userRepository.findByEmail(email)
                .flatMap(user -> {
                    return refreshTokenRepository.deleteByUserId(user.getId())
                            .then(userRepository.delete(user));
                })
                .doOnSuccess(v -> log.info("User with email {} deleted successfully", email));
    }

    private Mono<AuthResponse> generateAuthResponse(User user) {
        String accessToken = jwtTokenProvider.generateToken(user.getUsername(), user.getRole().name());
        String refreshToken = UUID.randomUUID().toString();

        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .userId(user.getId())
                .token(refreshToken)
                .expiryDate(LocalDateTime.now().plusDays(REFRESH_TOKEN_VALIDITY_DAYS))
                .createdAt(LocalDateTime.now())
                .build();

        return refreshTokenRepository.save(refreshTokenEntity)
                .map(savedToken -> AuthResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .tokenType("Bearer")
                        .expiresIn(jwtTokenProvider.getJwtExpiration())
                        .user(UserDto.builder()
                                .id(user.getId())
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .role(user.getRole())
                                .genre(user.getGenre() != null ? user.getGenre().name() : "HOMME")
                                .build())
                        .build());
    }
}
