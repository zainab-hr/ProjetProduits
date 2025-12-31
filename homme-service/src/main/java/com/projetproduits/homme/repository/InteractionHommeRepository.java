package com.projetproduits.homme.repository;

import com.projetproduits.homme.entity.InteractionHomme;
import com.projetproduits.homme.entity.TypeInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InteractionHommeRepository extends JpaRepository<InteractionHomme, Long> {

    List<InteractionHomme> findByUserId(Long userId);

    List<InteractionHomme> findByProduitId(Long produitId);

    List<InteractionHomme> findByTypeInteraction(TypeInteraction typeInteraction);

    List<InteractionHomme> findByUserIdAndTypeInteraction(Long userId, TypeInteraction typeInteraction);

    List<InteractionHomme> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT i FROM InteractionHomme i WHERE i.userId = :userId ORDER BY i.timestamp DESC")
    List<InteractionHomme> findRecentInteractionsByUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(i) FROM InteractionHomme i WHERE i.produitId = :produitId AND i.typeInteraction = :type")
    Long countInteractionsByProduitAndType(@Param("produitId") Long produitId, @Param("type") TypeInteraction type);

    // For AI/ML - Get all interactions for training data
    @Query("SELECT i FROM InteractionHomme i ORDER BY i.timestamp")
    List<InteractionHomme> findAllForTraining();
}
