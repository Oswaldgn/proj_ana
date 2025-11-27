package com.example.demo.auth.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.auth.domain.ProductComment;
import com.example.demo.auth.repository.ProductCommentRepository;

@Service
@Transactional
public class ProductCommentService {

    private final ProductCommentRepository repository;

    public ProductCommentService(ProductCommentRepository repository) {
        this.repository = repository;
    }

    public ProductComment createComment(ProductComment comment) {
        return repository.save(comment);
    }

    public List<ProductComment> getCommentsByProduct(Long productId) {
        return repository.findByProductId(productId);
    }

    public void deleteComment(Long commentId) {
        repository.deleteById(commentId);
    }

    public ProductComment getCommentById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Comentário não encontrado"));
    }
}
