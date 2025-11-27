package com.example.demo.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.auth.domain.ProductRating;

public interface ProductRatingRepository extends JpaRepository<ProductRating, Long> {

    Optional<ProductRating> findByProduct_IdAndUser_Id(Long productId, Long userId);

    void deleteByProduct_IdAndUser_Id(Long productId, Long userId);

    @Query("SELECT AVG(r.rating) FROM ProductRating r WHERE r.product.id = :productId")
    Optional<Double> getAverageRating(@Param("productId") Long productId);

}
