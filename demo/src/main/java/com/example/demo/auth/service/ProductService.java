package com.example.demo.auth.service;

import java.time.LocalDateTime;
import java.util.Comparator;
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

    // ===========================
    // LISTAR POR LOJA (EXISTENTE)
    // ===========================
    public List<ProductResponseDto> getByStore(Long storeId) {
        return productRepository.findByStore_Id(storeId)
                .stream()
                .map(ProductResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    // ===========================
    // CRIAR PRODUTO (EXISTENTE)
    // ===========================
    @Transactional
    public ProductResponseDto create(Long storeId, ProductRequestDto dto, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Store store = storeRepository.findById(storeId).orElseThrow();

        if (!"ADMIN".equals(String.valueOf(user.getRole())) &&
            !store.getOwner().getId().equals(user.getId())) {
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

    // ===========================
    // EDITAR PRODUTO (EXISTENTE)
    // ===========================
    @Transactional
    public ProductResponseDto update(Long id, ProductRequestDto dto, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Product product = productRepository.findById(id).orElseThrow();

        if (!"ADMIN".equals(String.valueOf(user.getRole())) &&
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

    // ===========================
    // DELETAR PRODUTO (EXISTENTE)
    // ===========================
    @Transactional
    public void delete(Long id, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Product product = productRepository.findById(id).orElseThrow();

        if (!"ADMIN".equals(String.valueOf(user.getRole())) &&
            !product.getStore().getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Você não tem permissão para excluir este produto.");
        }

        productRepository.delete(product);
    }

    // ==================================================
    // NOVO MÉTODO - LISTAGEM GERAL + BUSCA + TAGS + SORT
    // ==================================================
    public List<ProductResponseDto> listProducts(String search, String sortBy, List<String> tags) {

        List<Product> products;

        // 🔎 Garantir que search nunca será null
        String searchValue = (search == null) ? "" : search.trim();

        // 🔍 FILTROS
        if (tags != null && !tags.isEmpty()) {
            products = productRepository.findByTagsAndSearch(tags, searchValue);
        }
        else if (!searchValue.isEmpty()) {
            products = productRepository.searchProducts(searchValue);
        }
        else {
            products = productRepository.findAll();
        }

        // 🔽 ORDENAR RESULTADOS
        if (sortBy != null) {
            switch (sortBy) {
                case "price_asc":
                    products.sort(Comparator.comparing(Product::getPrice));
                    break;

                case "price_desc":
                    products.sort(Comparator.comparing(Product::getPrice).reversed());
                    break;

                case "newest":
                    products.sort(Comparator.comparing(Product::getCreatedAt).reversed());
                    break;

                case "oldest":
                    products.sort(Comparator.comparing(Product::getCreatedAt));
                    break;

                default:
                    break;
            }
        }

        // 🔄 Converter para DTO
        return products.stream()
                .map(ProductResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}
