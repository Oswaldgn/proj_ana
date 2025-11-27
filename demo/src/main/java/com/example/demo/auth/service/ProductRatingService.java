package com.example.demo.auth.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.auth.domain.Product;
import com.example.demo.auth.domain.ProductRating;
import com.example.demo.auth.domain.User;
import com.example.demo.auth.dto.ProductRatingResponseDto;
import com.example.demo.auth.dto.RatingRequest;
import com.example.demo.auth.repository.ProductRatingRepository;
import com.example.demo.auth.repository.ProductRepository;
import com.example.demo.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductRatingService {

    private final ProductRatingRepository ratingRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public ProductRatingResponseDto rateProduct(Long productId, String email, RatingRequest ratingRequest) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        Optional<ProductRating> existing = ratingRepository.findByProduct_IdAndUser_Id(productId, user.getId());

        ProductRating rating;

        if (existing.isPresent()) {
            rating = existing.get();
            rating.setRating(ratingRequest.getRating());
        } else {
            rating = ProductRating.builder()
                    .product(product)
                    .user(user)
                    .rating(ratingRequest.getRating())
                    .build();
        }

        ratingRepository.save(rating);

        double newAverage = ratingRepository.getAverageRating(productId).orElse(0.0);

        product.setAverageRating(newAverage);
        productRepository.save(product);

        return new ProductRatingResponseDto(newAverage);
    }

    @Transactional
    public void deleteUserRating(Long productId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        ratingRepository.deleteByProduct_IdAndUser_Id(productId, user.getId());

        double newAverage = ratingRepository.getAverageRating(productId).orElse(0.0);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        product.setAverageRating(newAverage);
        productRepository.save(product);
    }

    public Double getAverageRating(Long productId) {
        return ratingRepository.getAverageRating(productId).orElse(0.0);
    }
}
