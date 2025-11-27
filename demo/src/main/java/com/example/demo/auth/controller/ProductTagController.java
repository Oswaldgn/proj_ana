package com.example.demo.auth.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.auth.domain.Product;
import com.example.demo.auth.domain.ProductTag;
import com.example.demo.auth.dto.ProductTagRequestDto;
import com.example.demo.auth.dto.ProductTagResponseDto;
import com.example.demo.auth.service.ProductTagService;

@RestController
@RequestMapping("/api/tags")
public class ProductTagController {

    private final ProductTagService service;

    public ProductTagController(ProductTagService service) {
        this.service = service;
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<ProductTagResponseDto> createTag(
            @PathVariable Long productId,
            @RequestBody ProductTagRequestDto dto) {

        // 🔥 Impedir salvar tag sem nome
        if (dto.getTagName() == null || dto.getTagName().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        ProductTag tag = new ProductTag();
        tag.setTagName(dto.getTagName().trim());

        Product product = new Product();
        product.setId(productId);
        tag.setProduct(product);

        ProductTag saved = service.createTag(tag);
        return ResponseEntity.ok(ProductTagResponseDto.fromEntity(saved));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductTagResponseDto>> getTags(@PathVariable Long productId) {
        List<ProductTagResponseDto> dtos = service.getTagsByProduct(productId)
                .stream()
                .map(ProductTagResponseDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/{tagId}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long tagId) {
        service.deleteTag(tagId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<ProductTagResponseDto>> getAllTags() {
        List<ProductTagResponseDto> dtos = service.getAllTags()
                .stream()
                .map(ProductTagResponseDto::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}

