package com.example.demo.auth.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.auth.dto.ProductRatingResponseDto;
import com.example.demo.auth.dto.RatingRequest;
import com.example.demo.auth.service.ProductRatingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products/{productId}/rating")
@RequiredArgsConstructor
public class ProductRatingController {

    private final ProductRatingService ratingService;

    @PostMapping
    public ProductRatingResponseDto rate(
            @PathVariable("productId") Long productId,
            @RequestBody RatingRequest ratingRequest,
            Authentication authentication
    ) {
        String email = authentication.getName();
        return ratingService.rateProduct(productId, email, ratingRequest);
    }

    @DeleteMapping
    public void removeRating(
            @PathVariable("productId") Long productId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        ratingService.deleteUserRating(productId, email);
    }

    @GetMapping("/average")
    public Double getAverage(@PathVariable("productId") Long productId) {
        return ratingService.getAverageRating(productId);
    }
}
