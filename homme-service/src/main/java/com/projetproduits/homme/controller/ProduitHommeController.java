package com.projetproduits.homme.controller;

import com.projetproduits.homme.dto.ApiResponse;
import com.projetproduits.homme.dto.ProduitHommeDto;
import com.projetproduits.homme.service.ProduitHommeService;
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
public class ProduitHommeController {

    private final ProduitHommeService produitService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProduitHommeDto>>> getAllProduits() {
        log.info("GET /produits - Fetching all products");
        List<ProduitHommeDto> produits = produitService.findAll();
        return ResponseEntity.ok(ApiResponse.success(produits));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProduitHommeDto>> getProduitById(@PathVariable Long id) {
        log.info("GET /produits/{} - Fetching product by id", id);
        ProduitHommeDto produit = produitService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(produit));
    }

    @GetMapping("/categorie/{categorie}")
    public ResponseEntity<ApiResponse<List<ProduitHommeDto>>> getProduitsByCategorie(@PathVariable String categorie) {
        log.info("GET /produits/categorie/{} - Fetching products by category", categorie);
        List<ProduitHommeDto> produits = produitService.findByCategorie(categorie);
        return ResponseEntity.ok(ApiResponse.success(produits));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProduitHommeDto>>> searchProduits(@RequestParam String nom) {
        log.info("GET /produits/search?nom={} - Searching products", nom);
        List<ProduitHommeDto> produits = produitService.searchByNom(nom);
        return ResponseEntity.ok(ApiResponse.success(produits));
    }

    @GetMapping("/price-range")
    public ResponseEntity<ApiResponse<List<ProduitHommeDto>>> getProduitsByPriceRange(
            @RequestParam BigDecimal minPrix,
            @RequestParam BigDecimal maxPrix) {
        log.info("GET /produits/price-range?minPrix={}&maxPrix={} - Fetching products by price range", minPrix, maxPrix);
        List<ProduitHommeDto> produits = produitService.findByPriceRange(minPrix, maxPrix);
        return ResponseEntity.ok(ApiResponse.success(produits));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProduitHommeDto>> createProduit(@Valid @RequestBody ProduitHommeDto dto) {
        log.info("POST /produits - Creating new product: {}", dto.getNom());
        ProduitHommeDto created = produitService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProduitHommeDto>> updateProduit(
            @PathVariable Long id,
            @Valid @RequestBody ProduitHommeDto dto) {
        log.info("PUT /produits/{} - Updating product", id);
        ProduitHommeDto updated = produitService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduit(@PathVariable Long id) {
        log.info("DELETE /produits/{} - Deleting product", id);
        produitService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }
}
