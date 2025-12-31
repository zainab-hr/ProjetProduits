package com.projetproduits.femme.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProduitFemmeDto {

    private Long id;

    @NotBlank(message = "Nom is required")
    @Size(min = 2, max = 200, message = "Nom must be between 2 and 200 characters")
    private String nom;

    @NotBlank(message = "Categorie is required")
    private String categorie;

    @NotNull(message = "Prix is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Prix must be greater than 0")
    private BigDecimal prix;

    private String description;

    private String imageUrl;
}
