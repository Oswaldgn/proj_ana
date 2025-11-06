package com.example.demo.auth.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.demo.auth.domain.Product;
import com.example.demo.auth.domain.Store;
import com.example.demo.auth.domain.User;
import com.example.demo.auth.dto.ProductRequestDto;
import com.example.demo.auth.dto.ProductResponseDto;
import com.example.demo.auth.repository.ProductRepository;
import com.example.demo.auth.repository.StoreRepository;
import com.example.demo.auth.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;

    public List<ProductResponseDto> getByStore(Long storeId) {
        return productRepository.findByStoreId(storeId)
                .stream().map(ProductResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponseDto create(Long storeId, ProductRequestDto dto, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Store store = storeRepository.findById(storeId).orElseThrow();

        if(!"ADMIN".equals(String.valueOf(user.getRole())) && !store.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Você não tem permissão para adicionar produtos nesta loja.");
        }

        Product product = Product.builder()
                .name(dto.getName())
                .price(dto.getPrice())
                .quantity(dto.getQuantity())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .discount(dto.getDiscount())
                .createdAt(LocalDateTime.now())
                .store(store)
                .build();

        return ProductResponseDto.fromEntity(productRepository.save(product));
    }

    @Transactional
    public ProductResponseDto update(Long id, ProductRequestDto dto, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Product product = productRepository.findById(id).orElseThrow();

        if(!"ADMIN".equals(String.valueOf(user.getRole())) &&
           !product.getStore().getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Você não tem permissão para editar este produto.");
        }

        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setDescription(dto.getDescription());
        product.setImageUrl(dto.getImageUrl());
        product.setDiscount(dto.getDiscount());

        return ProductResponseDto.fromEntity(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Product product = productRepository.findById(id).orElseThrow();

        if(!"ADMIN".equals(String.valueOf(user.getRole())) &&
           !product.getStore().getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Você não tem permissão para excluir este produto.");
        }

        productRepository.delete(product);
    }
}
