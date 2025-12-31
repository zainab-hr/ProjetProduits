package com.projetproduits.homme.repository;

import com.projetproduits.homme.entity.UserHomme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserHommeRepository extends JpaRepository<UserHomme, Long> {

    Optional<UserHomme> findByEmail(String email);

    boolean existsByEmail(String email);

    List<UserHomme> findByNomContainingIgnoreCase(String nom);

    List<UserHomme> findByAgeBetween(Integer minAge, Integer maxAge);
}
