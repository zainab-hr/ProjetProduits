package com.projetproduits.homme.service;

import com.projetproduits.homme.dto.InteractionHommeDto;
import com.projetproduits.homme.entity.InteractionHomme;
import com.projetproduits.homme.entity.TypeInteraction;
import com.projetproduits.homme.exception.ResourceNotFoundException;
import com.projetproduits.homme.repository.InteractionHommeRepository;
import com.projetproduits.homme.repository.ProduitHommeRepository;
import com.projetproduits.homme.repository.UserHommeRepository;
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
public class InteractionHommeService {

    private final InteractionHommeRepository interactionRepository;
    private final UserHommeRepository userRepository;
    private final ProduitHommeRepository produitRepository;

    public List<InteractionHommeDto> findAll() {
        return interactionRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public InteractionHommeDto findById(Long id) {
        return interactionRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("InteractionHomme", id));
    }

    @Transactional
    public InteractionHommeDto create(InteractionHommeDto dto) {
        // Validate user exists
        if (!userRepository.existsById(dto.getUserId())) {
            throw new ResourceNotFoundException("UserHomme", dto.getUserId());
        }

        // Validate product exists
        if (!produitRepository.existsById(dto.getProduitId())) {
            throw new ResourceNotFoundException("ProduitHomme", dto.getProduitId());
        }

        InteractionHomme interaction = InteractionHomme.builder()
                .userId(dto.getUserId())
                .produitId(dto.getProduitId())
                .typeInteraction(dto.getTypeInteraction())
                .timestamp(dto.getTimestamp() != null ? dto.getTimestamp() : LocalDateTime.now())
                .build();

        InteractionHomme saved = interactionRepository.save(interaction);
        log.info("Created InteractionHomme with id: {} - User: {}, Product: {}, Type: {}", 
                saved.getId(), saved.getUserId(), saved.getProduitId(), saved.getTypeInteraction());
        return toDto(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!interactionRepository.existsById(id)) {
            throw new ResourceNotFoundException("InteractionHomme", id);
        }
        interactionRepository.deleteById(id);
        log.info("Deleted InteractionHomme with id: {}", id);
    }

    public List<InteractionHommeDto> findByUserId(Long userId) {
        return interactionRepository.findByUserId(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<InteractionHommeDto> findByProduitId(Long produitId) {
        return interactionRepository.findByProduitId(produitId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<InteractionHommeDto> findByType(TypeInteraction type) {
        return interactionRepository.findByTypeInteraction(type).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<InteractionHommeDto> findByUserIdAndType(Long userId, TypeInteraction type) {
        return interactionRepository.findByUserIdAndTypeInteraction(userId, type).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<InteractionHommeDto> findByDateRange(LocalDateTime start, LocalDateTime end) {
        return interactionRepository.findByTimestampBetween(start, end).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // For AI/ML training data export
    public List<InteractionHommeDto> getTrainingData() {
        return interactionRepository.findAllForTraining().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Long countByProduitAndType(Long produitId, TypeInteraction type) {
        return interactionRepository.countInteractionsByProduitAndType(produitId, type);
    }

    private InteractionHommeDto toDto(InteractionHomme interaction) {
        return InteractionHommeDto.builder()
                .id(interaction.getId())
                .userId(interaction.getUserId())
                .produitId(interaction.getProduitId())
                .typeInteraction(interaction.getTypeInteraction())
                .timestamp(interaction.getTimestamp())
                .build();
    }
}
