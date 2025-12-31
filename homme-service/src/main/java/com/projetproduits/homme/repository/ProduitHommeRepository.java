package com.projetproduits.homme.repository;

import com.projetproduits.homme.entity.ProduitHomme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProduitHommeRepository extends JpaRepository<ProduitHomme, Long> {

    List<ProduitHomme> findByCategorie(String categorie);

    List<ProduitHomme> findByNomContainingIgnoreCase(String nom);

    List<ProduitHomme> findByPrixBetween(BigDecimal minPrix, BigDecimal maxPrix);

    List<ProduitHomme> findByCategorieAndPrixLessThanEqual(String categorie, BigDecimal maxPrix);
}
