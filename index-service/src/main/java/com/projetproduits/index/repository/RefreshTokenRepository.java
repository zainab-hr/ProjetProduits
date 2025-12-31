package com.projetproduits.index.repository;

import com.projetproduits.index.entity.RefreshToken;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface RefreshTokenRepository extends ReactiveCrudRepository<RefreshToken, Long> {

    Mono<RefreshToken> findByToken(String token);

    Mono<Void> deleteByUserId(Long userId);

    Mono<Void> deleteByToken(String token);
}
