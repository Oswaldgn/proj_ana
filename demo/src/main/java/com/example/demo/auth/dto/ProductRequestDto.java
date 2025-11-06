package com.example.demo.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ProductRequestDto {
    private String name;
    private Double price;
    private Integer quantity;
    private String description;
    private String imageUrl;
    private Double discount;
}
