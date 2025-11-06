package com.example.demo.auth.dto;

import java.time.format.DateTimeFormatter;

import com.example.demo.auth.domain.Product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ProductResponseDto {

    private Long id;
    private String name;
    private Double price;
    private Integer quantity;
    private String description;
    private String imageUrl;
    private Double discount;
    private String createdAt;
    private Long storeId;
    private String storeName;

    public static ProductResponseDto fromEntity(Product product) {
        return ProductResponseDto.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .description(product.getDescription())
                .imageUrl(product.getImageUrl())
                .discount(product.getDiscount())
                .createdAt(product.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")))
                .storeId(product.getStore().getId())
                .storeName(product.getStore().getName())
                .build();
    }
}
