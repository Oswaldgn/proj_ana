package com.example.demo.auth.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.auth.domain.ProductComment;

public interface ProductCommentRepository extends JpaRepository<ProductComment, Long> {
    List<ProductComment> findByProductId(Long productId);
    List<ProductComment> findByUserId(Long userId);
}
