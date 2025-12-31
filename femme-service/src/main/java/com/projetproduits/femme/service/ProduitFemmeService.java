package com.projetproduits.femme.service;

import com.projetproduits.femme.dto.ProduitFemmeDto;
import com.projetproduits.femme.entity.ProduitFemme;
import com.projetproduits.femme.exception.ResourceNotFoundException;
import com.projetproduits.femme.repository.ProduitFemmeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProduitFemmeService {

    private final ProduitFemmeRepository produitRepository;

    public List<ProduitFemmeDto> findAll() {
        return produitRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ProduitFemmeDto findById(Long id) {
        return produitRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("ProduitFemme", id));
    }

    @Transactional
    public ProduitFemmeDto create(ProduitFemmeDto dto) {
        ProduitFemme produit = ProduitFemme.builder()
                .nom(dto.getNom())
                .categorie(dto.getCategorie())
                .prix(dto.getPrix())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .build();

        ProduitFemme saved = produitRepository.save(produit);
        log.info("Created ProduitFemme with id: {}", saved.getId());
        return toDto(saved);
    }

    @Transactional
    public ProduitFemmeDto update(Long id, ProduitFemmeDto dto) {
        ProduitFemme produit = produitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProduitFemme", id));

        produit.setNom(dto.getNom());
        produit.setCategorie(dto.getCategorie());
        produit.setPrix(dto.getPrix());
        produit.setDescription(dto.getDescription());
        produit.setImageUrl(dto.getImageUrl());

        ProduitFemme updated = produitRepository.save(produit);
        log.info("Updated ProduitFemme with id: {}", updated.getId());
        return toDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        if (!produitRepository.existsById(id)) {
            throw new ResourceNotFoundException("ProduitFemme", id);
        }
        produitRepository.deleteById(id);
        log.info("Deleted ProduitFemme with id: {}", id);
    }

    public List<ProduitFemmeDto> findByCategorie(String categorie) {
        return produitRepository.findByCategorie(categorie).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ProduitFemmeDto> searchByNom(String nom) {
        return produitRepository.findByNomContainingIgnoreCase(nom).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ProduitFemmeDto> findByPriceRange(BigDecimal minPrix, BigDecimal maxPrix) {
        return produitRepository.findByPrixBetween(minPrix, maxPrix).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private ProduitFemmeDto toDto(ProduitFemme produit) {
        return ProduitFemmeDto.builder()
                .id(produit.getId())
                .nom(produit.getNom())
                .categorie(produit.getCategorie())
                .prix(produit.getPrix())
                .description(produit.getDescription())
                .imageUrl(produit.getImageUrl())
                .build();
    }
}
