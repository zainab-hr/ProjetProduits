package com.projetproduits.index.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;

import com.projetproduits.index.security.JwtTokenProvider;

import reactor.core.publisher.Mono;

@Slf4j
@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    private final JwtTokenProvider jwtTokenProvider;

    public AuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        super(Config.class);
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            
            // Allow public GET access to products endpoints
            // Check original path before StripPrefix is applied
            String path = request.getURI().getPath();
            String method = request.getMethod().name();
            log.debug("AuthenticationFilter checking path: {} method: {}", path, method);
            
            // Check for /produits paths (after StripPrefix removes /api/homme or /api/femme)
            if ("GET".equalsIgnoreCase(method) && path.startsWith("/produits")) {
                log.debug("Allowing public access to products endpoint");
                return chain.filter(exchange);
            }
            
            String token = extractToken(request);

            if (!StringUtils.hasText(token)) {
                return onError(exchange, "Missing authorization header", HttpStatus.UNAUTHORIZED);
            }

            if (!jwtTokenProvider.validateToken(token)) {
                return onError(exchange, "Invalid or expired token", HttpStatus.UNAUTHORIZED);
            }

            // Add user information to headers for downstream services
            String username = jwtTokenProvider.extractUsername(token);
            String role = jwtTokenProvider.extractRole(token);

            ServerHttpRequest modifiedRequest = request.mutate()
                    .header("X-User-Username", username)
                    .header("X-User-Role", role)
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        };
    }

    private String extractToken(ServerHttpRequest request) {
        String bearerToken = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        log.error("Authentication error: {}", message);
        exchange.getResponse().setStatusCode(status);
        return exchange.getResponse().setComplete();
    }

    public static class Config {
        // Configuration properties if needed
    }
}
