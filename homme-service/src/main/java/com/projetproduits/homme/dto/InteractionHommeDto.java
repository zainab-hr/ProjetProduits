package com.projetproduits.homme.dto;

import com.projetproduits.homme.entity.TypeInteraction;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InteractionHommeDto {

    private Long id;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Produit ID is required")
    private Long produitId;

    @NotNull(message = "Type interaction is required")
    private TypeInteraction typeInteraction;

    private LocalDateTime timestamp;
}
