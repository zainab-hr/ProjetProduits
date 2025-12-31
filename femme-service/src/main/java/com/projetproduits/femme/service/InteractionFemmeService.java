package com.projetproduits.femme.service;

import com.projetproduits.femme.dto.InteractionFemmeDto;
import com.projetproduits.femme.entity.InteractionFemme;
import com.projetproduits.femme.entity.TypeInteraction;
import com.projetproduits.femme.exception.ResourceNotFoundException;
import com.projetproduits.femme.repository.InteractionFemmeRepository;
import com.projetproduits.femme.repository.ProduitFemmeRepository;
import com.projetproduits.femme.repository.UserFemmeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InteractionFemmeService {

    private final InteractionFemmeRepository interactionRepository;
    private final UserFemmeRepository userRepository;
    private final ProduitFemmeRepository produitRepository;

    public List<InteractionFemmeDto> findAll() {
        return interactionRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public InteractionFemmeDto findById(Long id) {
        return interactionRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("InteractionFemme", id));
    }

    @Transactional
    public InteractionFemmeDto create(InteractionFemmeDto dto) {
        // Validate user exists
        if (!userRepository.existsById(dto.getUserId())) {
            throw new ResourceNotFoundException("UserFemme", dto.getUserId());
        }

        // Validate product exists
        if (!produitRepository.existsById(dto.getProduitId())) {
            throw new ResourceNotFoundException("ProduitFemme", dto.getProduitId());
        }

        InteractionFemme interaction = InteractionFemme.builder()
                .userId(dto.getUserId())
                .produitId(dto.getProduitId())
                .typeInteraction(dto.getTypeInteraction())
                .timestamp(dto.getTimestamp() != null ? dto.getTimestamp() : LocalDateTime.now())
                .build();

        InteractionFemme saved = interactionRepository.save(interaction);
        log.info("Created InteractionFemme with id: {} - User: {}, Product: {}, Type: {}", 
                saved.getId(), saved.getUserId(), saved.getProduitId(), saved.getTypeInteraction());
        return toDto(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!interactionRepository.existsById(id)) {
            throw new ResourceNotFoundException("InteractionFemme", id);
        }
        interactionRepository.deleteById(id);
        log.info("Deleted InteractionFemme with id: {}", id);
    }

    public List<InteractionFemmeDto> findByUserId(Long userId) {
        return interactionRepository.findByUserId(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<InteractionFemmeDto> findByProduitId(Long produitId) {
        return interactionRepository.findByProduitId(produitId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<InteractionFemmeDto> findByType(TypeInteraction type) {
        return interactionRepository.findByTypeInteraction(type).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<InteractionFemmeDto> findByUserIdAndType(Long userId, TypeInteraction type) {
        return interactionRepository.findByUserIdAndTypeInteraction(userId, type).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<InteractionFemmeDto> findByDateRange(LocalDateTime start, LocalDateTime end) {
        return interactionRepository.findByTimestampBetween(start, end).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // For AI/ML training data export
    public List<InteractionFemmeDto> getTrainingData() {
        return interactionRepository.findAllForTraining().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Long countByProduitAndType(Long produitId, TypeInteraction type) {
        return interactionRepository.countInteractionsByProduitAndType(produitId, type);
    }

    private InteractionFemmeDto toDto(InteractionFemme interaction) {
        return InteractionFemmeDto.builder()
                .id(interaction.getId())
                .userId(interaction.getUserId())
                .produitId(interaction.getProduitId())
                .typeInteraction(interaction.getTypeInteraction())
                .timestamp(interaction.getTimestamp())
                .build();
    }
}
