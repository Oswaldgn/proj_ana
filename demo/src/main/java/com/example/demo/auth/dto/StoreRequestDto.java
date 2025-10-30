package com.example.demo.auth.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Data Transfer Object para requisições de criação ou atualização de loja.
 */
@Getter
@Setter
public class StoreRequestDto {
    private String name;
    private String address;
    private String contact;
    private String imageUrl;
    private String description;
}
