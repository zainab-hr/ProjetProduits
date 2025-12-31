package com.projetproduits.femme.service;

import com.projetproduits.femme.dto.UserFemmeDto;
import com.projetproduits.femme.entity.UserFemme;
import com.projetproduits.femme.exception.DuplicateResourceException;
import com.projetproduits.femme.exception.ResourceNotFoundException;
import com.projetproduits.femme.repository.UserFemmeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserFemmeService {

    private final UserFemmeRepository userRepository;

    public List<UserFemmeDto> findAll() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public UserFemmeDto findById(Long id) {
        return userRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("UserFemme", id));
    }

    public UserFemmeDto findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("UserFemme not found with email: " + email));
    }

    @Transactional
    public UserFemmeDto create(UserFemmeDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + dto.getEmail());
        }

        UserFemme user = UserFemme.builder()
                .nom(dto.getNom())
                .email(dto.getEmail())
                .age(dto.getAge())
                .build();

        UserFemme saved = userRepository.save(user);
        log.info("Created UserFemme with id: {}", saved.getId());
        return toDto(saved);
    }

    @Transactional
    public UserFemmeDto update(Long id, UserFemmeDto dto) {
        UserFemme user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserFemme", id));

        // Check if email is being changed to an existing one
        if (!user.getEmail().equals(dto.getEmail()) && userRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + dto.getEmail());
        }

        user.setNom(dto.getNom());
        user.setEmail(dto.getEmail());
        user.setAge(dto.getAge());

        UserFemme updated = userRepository.save(user);
        log.info("Updated UserFemme with id: {}", updated.getId());
        return toDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("UserFemme", id);
        }
        userRepository.deleteById(id);
        log.info("Deleted UserFemme with id: {}", id);
    }

    public List<UserFemmeDto> searchByNom(String nom) {
        return userRepository.findByNomContainingIgnoreCase(nom).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<UserFemmeDto> findByAgeRange(Integer minAge, Integer maxAge) {
        return userRepository.findByAgeBetween(minAge, maxAge).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private UserFemmeDto toDto(UserFemme user) {
        return UserFemmeDto.builder()
                .id(user.getId())
                .nom(user.getNom())
                .email(user.getEmail())
                .age(user.getAge())
                .build();
    }
}
