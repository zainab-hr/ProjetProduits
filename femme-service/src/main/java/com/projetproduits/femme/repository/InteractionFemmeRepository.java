package com.projetproduits.femme.repository;

import com.projetproduits.femme.entity.InteractionFemme;
import com.projetproduits.femme.entity.TypeInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InteractionFemmeRepository extends JpaRepository<InteractionFemme, Long> {

    List<InteractionFemme> findByUserId(Long userId);

    List<InteractionFemme> findByProduitId(Long produitId);

    List<InteractionFemme> findByTypeInteraction(TypeInteraction typeInteraction);

    List<InteractionFemme> findByUserIdAndTypeInteraction(Long userId, TypeInteraction typeInteraction);

    List<InteractionFemme> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT i FROM InteractionFemme i WHERE i.userId = :userId ORDER BY i.timestamp DESC")
    List<InteractionFemme> findRecentInteractionsByUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(i) FROM InteractionFemme i WHERE i.produitId = :produitId AND i.typeInteraction = :type")
    Long countInteractionsByProduitAndType(@Param("produitId") Long produitId, @Param("type") TypeInteraction type);

    // For AI/ML - Get all interactions for training data
    @Query("SELECT i FROM InteractionFemme i ORDER BY i.timestamp")
    List<InteractionFemme> findAllForTraining();
}
