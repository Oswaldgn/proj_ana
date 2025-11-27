package com.example.demo.auth.dto;

import com.example.demo.auth.domain.ProductComment;

public class ProductCommentResponseDto {

    private Long id;
    private Long productId;
    private Long userId;
    private String userName; 
    private String comment;
    private String createdAt;

    public ProductCommentResponseDto() {}

    public ProductCommentResponseDto(Long id, Long productId, Long userId, String comment) {
        this.id = id;
        this.productId = productId;
        this.userId = userId;
        this.comment = comment;
    }

    public static ProductCommentResponseDto fromEntity(ProductComment comment) {
        ProductCommentResponseDto dto = new ProductCommentResponseDto();
        dto.setId(comment.getId());
        dto.setProductId(comment.getProductId());
        dto.setUserId(comment.getUserId());
        dto.setComment(comment.getComment());
        if (comment.getCreatedAt() != null) {
            dto.setCreatedAt(comment.getCreatedAt().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        }
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
