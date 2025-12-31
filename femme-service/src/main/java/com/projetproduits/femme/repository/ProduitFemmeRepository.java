package com.projetproduits.femme.repository;

import com.projetproduits.femme.entity.ProduitFemme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProduitFemmeRepository extends JpaRepository<ProduitFemme, Long> {

    List<ProduitFemme> findByCategorie(String categorie);

    List<ProduitFemme> findByNomContainingIgnoreCase(String nom);

    List<ProduitFemme> findByPrixBetween(BigDecimal minPrix, BigDecimal maxPrix);

    List<ProduitFemme> findByCategorieAndPrixLessThanEqual(String categorie, BigDecimal maxPrix);
}
