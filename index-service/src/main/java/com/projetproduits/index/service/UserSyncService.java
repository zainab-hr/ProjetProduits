package com.projetproduits.index.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Slf4j
@Service
public class UserSyncService {

    private final WebClient hommeServiceWebClient;
    private final WebClient femmeServiceWebClient;

    public UserSyncService(
            @Qualifier("hommeServiceWebClient") WebClient hommeServiceWebClient,
            @Qualifier("femmeServiceWebClient") WebClient femmeServiceWebClient) {
        this.hommeServiceWebClient = hommeServiceWebClient;
        this.femmeServiceWebClient = femmeServiceWebClient;
    }

    /**
     * Creates a user in the appropriate genre-specific database (homme or femme)
     * 
     * @param username the username of the user
     * @param email the email of the user
     * @param genre the genre (HOMME or FEMME)
     * @return a Mono that completes when the user is created
     */
    public Mono<Void> syncUserToGenreDatabase(String username, String email, String genre) {
        Map<String, Object> userPayload = Map.of(
                "nom", username,
                "email", email,
                "age", 25  // Default age, can be updated later by the user
        );

        if ("HOMME".equalsIgnoreCase(genre)) {
            log.info("Syncing user {} to homme database", email);
            return hommeServiceWebClient.post()
                    .uri("/users")
                    .bodyValue(userPayload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .doOnSuccess(response -> log.info("Successfully synced user {} to homme database", email))
                    .doOnError(error -> log.error("Failed to sync user {} to homme database: {}", email, error.getMessage()))
                    .onErrorResume(error -> {
                        log.warn("Could not sync user to homme database, continuing anyway: {}", error.getMessage());
                        return Mono.empty();
                    })
                    .then();
        } else if ("FEMME".equalsIgnoreCase(genre)) {
            log.info("Syncing user {} to femme database", email);
            return femmeServiceWebClient.post()
                    .uri("/users")
                    .bodyValue(userPayload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .doOnSuccess(response -> log.info("Successfully synced user {} to femme database", email))
                    .doOnError(error -> log.error("Failed to sync user {} to femme database: {}", email, error.getMessage()))
                    .onErrorResume(error -> {
                        log.warn("Could not sync user to femme database, continuing anyway: {}", error.getMessage());
                        return Mono.empty();
                    })
                    .then();
        } else {
            log.warn("Unknown genre {}, not syncing user {} to any database", genre, email);
            return Mono.empty();
        }
    }
}
