package com.example.demo.auth.dto;

import com.example.demo.auth.domain.Store;

import lombok.Builder;
import lombok.Data;

/**
 * Data Transfer Object para respostas contendo informações da loja.
 */
@Data
@Builder
public class StoreResponseDto {
    private Long id;
    private String name;
    private String address;
    private String contact; 
    private String imageUrl;
    private String description;
    private Long ownerId;
    private String ownerEmail;

    public static StoreResponseDto fromEntity(Store store) {
        return StoreResponseDto.builder()
                .id(store.getId())
                .name(store.getName())
                .address(store.getAddress())
                .contact(store.getContact())
                .imageUrl(store.getImageUrl())
                .description(store.getDescription())
                .ownerId(store.getOwner().getId())
                .ownerEmail(store.getOwner().getEmail())
                .build();
    }
}
