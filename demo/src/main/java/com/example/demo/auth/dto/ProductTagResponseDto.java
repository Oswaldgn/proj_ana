package com.example.demo.auth.dto;

import com.example.demo.auth.domain.ProductTag;

public class ProductTagResponseDto {
    private Long id;
    private Long productId; 
    private String tagName;

    public ProductTagResponseDto() {}

    public static ProductTagResponseDto fromEntity(ProductTag tag) {
        ProductTagResponseDto dto = new ProductTagResponseDto();
        dto.setId(tag.getId());
        dto.setProductId(tag.getProduct() != null ? tag.getProduct().getId() : null); 
        dto.setTagName(tag.getTagName());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getTagName() { return tagName; }
    public void setTagName(String tagName) { this.tagName = tagName; }
}
