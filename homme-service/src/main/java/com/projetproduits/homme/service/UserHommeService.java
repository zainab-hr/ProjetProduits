package com.projetproduits.homme.service;

import com.projetproduits.homme.dto.UserHommeDto;
import com.projetproduits.homme.entity.UserHomme;
import com.projetproduits.homme.exception.DuplicateResourceException;
import com.projetproduits.homme.exception.ResourceNotFoundException;
import com.projetproduits.homme.repository.UserHommeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserHommeService {

    private final UserHommeRepository userRepository;

    public List<UserHommeDto> findAll() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public UserHommeDto findById(Long id) {
        return userRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("UserHomme", id));
    }

    public UserHommeDto findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("UserHomme not found with email: " + email));
    }

    @Transactional
    public UserHommeDto create(UserHommeDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + dto.getEmail());
        }

        UserHomme user = UserHomme.builder()
                .nom(dto.getNom())
                .email(dto.getEmail())
                .age(dto.getAge())
                .build();

        UserHomme saved = userRepository.save(user);
        log.info("Created UserHomme with id: {}", saved.getId());
        return toDto(saved);
    }

    @Transactional
    public UserHommeDto update(Long id, UserHommeDto dto) {
        UserHomme user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserHomme", id));

        // Check if email is being changed to an existing one
        if (!user.getEmail().equals(dto.getEmail()) && userRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + dto.getEmail());
        }

        user.setNom(dto.getNom());
        user.setEmail(dto.getEmail());
        user.setAge(dto.getAge());

        UserHomme updated = userRepository.save(user);
        log.info("Updated UserHomme with id: {}", updated.getId());
        return toDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("UserHomme", id);
        }
        userRepository.deleteById(id);
        log.info("Deleted UserHomme with id: {}", id);
    }

    public List<UserHommeDto> searchByNom(String nom) {
        return userRepository.findByNomContainingIgnoreCase(nom).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<UserHommeDto> findByAgeRange(Integer minAge, Integer maxAge) {
        return userRepository.findByAgeBetween(minAge, maxAge).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private UserHommeDto toDto(UserHomme user) {
        return UserHommeDto.builder()
                .id(user.getId())
                .nom(user.getNom())
                .email(user.getEmail())
                .age(user.getAge())
                .build();
    }
}
