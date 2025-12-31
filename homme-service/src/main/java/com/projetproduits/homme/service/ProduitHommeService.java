package com.projetproduits.homme.service;

import com.projetproduits.homme.dto.ProduitHommeDto;
import com.projetproduits.homme.entity.ProduitHomme;
import com.projetproduits.homme.exception.ResourceNotFoundException;
import com.projetproduits.homme.repository.ProduitHommeRepository;
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
public class ProduitHommeService {

    private final ProduitHommeRepository produitRepository;

    public List<ProduitHommeDto> findAll() {
        return produitRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ProduitHommeDto findById(Long id) {
        return produitRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("ProduitHomme", id));
    }

    @Transactional
    public ProduitHommeDto create(ProduitHommeDto dto) {
        ProduitHomme produit = ProduitHomme.builder()
                .nom(dto.getNom())
                .categorie(dto.getCategorie())
                .prix(dto.getPrix())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .build();

        ProduitHomme saved = produitRepository.save(produit);
        log.info("Created ProduitHomme with id: {}", saved.getId());
        return toDto(saved);
    }

    @Transactional
    public ProduitHommeDto update(Long id, ProduitHommeDto dto) {
        ProduitHomme produit = produitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProduitHomme", id));

        produit.setNom(dto.getNom());
        produit.setCategorie(dto.getCategorie());
        produit.setPrix(dto.getPrix());
        produit.setDescription(dto.getDescription());
        produit.setImageUrl(dto.getImageUrl());

        ProduitHomme updated = produitRepository.save(produit);
        log.info("Updated ProduitHomme with id: {}", updated.getId());
        return toDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        if (!produitRepository.existsById(id)) {
            throw new ResourceNotFoundException("ProduitHomme", id);
        }
        produitRepository.deleteById(id);
        log.info("Deleted ProduitHomme with id: {}", id);
    }

    public List<ProduitHommeDto> findByCategorie(String categorie) {
        return produitRepository.findByCategorie(categorie).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ProduitHommeDto> searchByNom(String nom) {
        return produitRepository.findByNomContainingIgnoreCase(nom).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ProduitHommeDto> findByPriceRange(BigDecimal minPrix, BigDecimal maxPrix) {
        return produitRepository.findByPrixBetween(minPrix, maxPrix).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private ProduitHommeDto toDto(ProduitHomme produit) {
        return ProduitHommeDto.builder()
                .id(produit.getId())
                .nom(produit.getNom())
                .categorie(produit.getCategorie())
                .prix(produit.getPrix())
                .description(produit.getDescription())
                .imageUrl(produit.getImageUrl())
                .build();
    }
}
