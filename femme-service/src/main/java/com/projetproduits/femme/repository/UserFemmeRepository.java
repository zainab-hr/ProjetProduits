package com.projetproduits.femme.repository;

import com.projetproduits.femme.entity.UserFemme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFemmeRepository extends JpaRepository<UserFemme, Long> {

    Optional<UserFemme> findByEmail(String email);

    boolean existsByEmail(String email);

    List<UserFemme> findByNomContainingIgnoreCase(String nom);

    List<UserFemme> findByAgeBetween(Integer minAge, Integer maxAge);
}
