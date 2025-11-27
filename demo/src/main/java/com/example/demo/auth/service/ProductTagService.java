package com.example.demo.auth.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.auth.domain.ProductTag;
import com.example.demo.auth.repository.ProductTagRepository;

@Service
public class ProductTagService {

    private final ProductTagRepository repository;

    public ProductTagService(ProductTagRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public ProductTag createTag(ProductTag tag) {
        return repository.save(tag);
    }

    public List<ProductTag> getTagsByProduct(Long productId) {
        return repository.findByProductId(productId);
    }

    @Transactional
    public void deleteTag(Long tagId) {
        repository.deleteById(tagId);
    }

    public List<ProductTag> getAllTags() {
        return repository.findAll();
    }

}
