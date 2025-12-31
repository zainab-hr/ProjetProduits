package com.projetproduits.femme.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "interactions_femme")
public class InteractionFemme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "produit_id", nullable = false)
    private Long produitId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_interaction", nullable = false)
    private TypeInteraction typeInteraction;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private UserFemme user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produit_id", insertable = false, updatable = false)
    private ProduitFemme produit;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
