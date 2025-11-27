package com.example.demo.auth.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.auth.dto.ProductRequestDto;
import com.example.demo.auth.dto.ProductResponseDto;
import com.example.demo.auth.service.ProductService;

import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PermitAll
    @GetMapping
    public List<ProductResponseDto> listAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) List<String> tags) {

        return productService.listProducts(search, sortBy, tags);
    }



    @PermitAll
    @GetMapping("/store/{storeId}")
    public List<ProductResponseDto> getByStore(@PathVariable Long storeId) {
        return productService.getByStore(storeId);
    }

    @PostMapping("/store/{storeId}")
    public ProductResponseDto create(@PathVariable Long storeId,
                                     @RequestBody ProductRequestDto dto,
                                     Principal principal) {
        return productService.create(storeId, dto, principal.getName());
    }

    @PutMapping("/{id}")
    public ProductResponseDto update(@PathVariable Long id,
                                     @RequestBody ProductRequestDto dto,
                                     Principal principal) {
        return productService.update(id, dto, principal.getName());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Principal principal) {
        productService.delete(id, principal.getName());
    }
}