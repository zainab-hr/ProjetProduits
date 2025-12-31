package com.projetproduits.femme.controller;

import com.projetproduits.femme.dto.ApiResponse;
import com.projetproduits.femme.dto.ProduitFemmeDto;
import com.projetproduits.femme.service.ProduitFemmeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/produits")
@RequiredArgsConstructor
public class ProduitFemmeController {

    private final ProduitFemmeService produitService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProduitFemmeDto>>> getAllProduits() {
        log.info("GET /produits - Fetching all products");
        List<ProduitFemmeDto> produits = produitService.findAll();
        return ResponseEntity.ok(ApiResponse.success(produits));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProduitFemmeDto>> getProduitById(@PathVariable Long id) {
        log.info("GET /produits/{} - Fetching product by id", id);
        ProduitFemmeDto produit = produitService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(produit));
    }

    @GetMapping("/categorie/{categorie}")
    public ResponseEntity<ApiResponse<List<ProduitFemmeDto>>> getProduitsByCategorie(@PathVariable String categorie) {
        log.info("GET /produits/categorie/{} - Fetching products by category", categorie);
        List<ProduitFemmeDto> produits = produitService.findByCategorie(categorie);
        return ResponseEntity.ok(ApiResponse.success(produits));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProduitFemmeDto>>> searchProduits(@RequestParam String nom) {
        log.info("GET /produits/search?nom={} - Searching products", nom);
        List<ProduitFemmeDto> produits = produitService.searchByNom(nom);
        return ResponseEntity.ok(ApiResponse.success(produits));
    }

    @GetMapping("/price-range")
    public ResponseEntity<ApiResponse<List<ProduitFemmeDto>>> getProduitsByPriceRange(
            @RequestParam BigDecimal minPrix,
            @RequestParam BigDecimal maxPrix) {
        log.info("GET /produits/price-range?minPrix={}&maxPrix={} - Fetching products by price range", minPrix, maxPrix);
        List<ProduitFemmeDto> produits = produitService.findByPriceRange(minPrix, maxPrix);
        return ResponseEntity.ok(ApiResponse.success(produits));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProduitFemmeDto>> createProduit(@Valid @RequestBody ProduitFemmeDto dto) {
        log.info("POST /produits - Creating new product: {}", dto.getNom());
        ProduitFemmeDto created = produitService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProduitFemmeDto>> updateProduit(
            @PathVariable Long id,
            @Valid @RequestBody ProduitFemmeDto dto) {
        log.info("PUT /produits/{} - Updating product", id);
        ProduitFemmeDto updated = produitService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduit(@PathVariable Long id) {
        log.info("DELETE /produits/{} - Deleting product", id);
        produitService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }
}
