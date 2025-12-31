package com.projetproduits.index.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("refresh_tokens")
public class RefreshToken {

    @Id
    private Long id;

    @Column("user_id")
    private Long userId;

    @Column("token")
    private String token;

    @Column("expiry_date")
    private LocalDateTime expiryDate;

    @Column("created_at")
    private LocalDateTime createdAt;
}
