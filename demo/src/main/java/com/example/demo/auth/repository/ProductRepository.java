package com.example.demo.auth.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.auth.domain.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByStore_Id(Long storeId);

    @Query("SELECT p FROM Product p WHERE " +
       "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
       " OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
List<Product> searchProducts(@Param("search") String search);

@Query("""
       SELECT DISTINCT p FROM Product p 
       JOIN p.tags t 
       WHERE t.tagName IN :tags
         AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))
       """)
List<Product> findByTagsAndSearch(@Param("tags") List<String> tags,
                                  @Param("search") String search);

}
