package com.projetproduits.homme.controller;

import com.projetproduits.homme.dto.ApiResponse;
import com.projetproduits.homme.dto.InteractionHommeDto;
import com.projetproduits.homme.entity.TypeInteraction;
import com.projetproduits.homme.service.InteractionHommeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/interactions")
@RequiredArgsConstructor
public class InteractionHommeController {

    private final InteractionHommeService interactionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<InteractionHommeDto>>> getAllInteractions() {
        log.info("GET /interactions - Fetching all interactions");
        List<InteractionHommeDto> interactions = interactionService.findAll();
        return ResponseEntity.ok(ApiResponse.success(interactions));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InteractionHommeDto>> getInteractionById(@PathVariable Long id) {
        log.info("GET /interactions/{} - Fetching interaction by id", id);
        InteractionHommeDto interaction = interactionService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(interaction));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<InteractionHommeDto>>> getInteractionsByUser(@PathVariable Long userId) {
        log.info("GET /interactions/user/{} - Fetching interactions by user", userId);
        List<InteractionHommeDto> interactions = interactionService.findByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(interactions));
    }

    @GetMapping("/produit/{produitId}")
    public ResponseEntity<ApiResponse<List<InteractionHommeDto>>> getInteractionsByProduit(@PathVariable Long produitId) {
        log.info("GET /interactions/produit/{} - Fetching interactions by product", produitId);
        List<InteractionHommeDto> interactions = interactionService.findByProduitId(produitId);
        return ResponseEntity.ok(ApiResponse.success(interactions));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<InteractionHommeDto>>> getInteractionsByType(@PathVariable TypeInteraction type) {
        log.info("GET /interactions/type/{} - Fetching interactions by type", type);
        List<InteractionHommeDto> interactions = interactionService.findByType(type);
        return ResponseEntity.ok(ApiResponse.success(interactions));
    }

    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<ApiResponse<List<InteractionHommeDto>>> getInteractionsByUserAndType(
            @PathVariable Long userId,
            @PathVariable TypeInteraction type) {
        log.info("GET /interactions/user/{}/type/{} - Fetching interactions by user and type", userId, type);
        List<InteractionHommeDto> interactions = interactionService.findByUserIdAndType(userId, type);
        return ResponseEntity.ok(ApiResponse.success(interactions));
    }

    @GetMapping("/date-range")
    public ResponseEntity<ApiResponse<List<InteractionHommeDto>>> getInteractionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        log.info("GET /interactions/date-range?start={}&end={} - Fetching interactions by date range", start, end);
        List<InteractionHommeDto> interactions = interactionService.findByDateRange(start, end);
        return ResponseEntity.ok(ApiResponse.success(interactions));
    }

    @GetMapping("/produit/{produitId}/count/{type}")
    public ResponseEntity<ApiResponse<Long>> countInteractionsByProduitAndType(
            @PathVariable Long produitId,
            @PathVariable TypeInteraction type) {
        log.info("GET /interactions/produit/{}/count/{} - Counting interactions", produitId, type);
        Long count = interactionService.countByProduitAndType(produitId, type);
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    // Endpoint for AI/ML training data export
    @GetMapping("/training-data")
    public ResponseEntity<ApiResponse<List<InteractionHommeDto>>> getTrainingData() {
        log.info("GET /interactions/training-data - Fetching training data for AI/ML");
        List<InteractionHommeDto> data = interactionService.getTrainingData();
        return ResponseEntity.ok(ApiResponse.success("Training data retrieved successfully", data));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InteractionHommeDto>> createInteraction(@Valid @RequestBody InteractionHommeDto dto) {
        log.info("POST /interactions - Creating new interaction: User={}, Product={}, Type={}", 
                dto.getUserId(), dto.getProduitId(), dto.getTypeInteraction());
        InteractionHommeDto created = interactionService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Interaction recorded successfully", created));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteInteraction(@PathVariable Long id) {
        log.info("DELETE /interactions/{} - Deleting interaction", id);
        interactionService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Interaction deleted successfully", null));
    }
}
