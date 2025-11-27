package com.example.demo.auth.controller;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.auth.domain.ProductComment;
import com.example.demo.auth.domain.User;
import com.example.demo.auth.dto.ProductCommentRequestDto;
import com.example.demo.auth.dto.ProductCommentResponseDto;
import com.example.demo.auth.service.ProductCommentService;
import com.example.demo.auth.service.UserService;

/**
 * Controle de comentários de produtos. Responsável por lidar com as rotas relacionadas às operações de comentários.
 * @param commentService Serviço de comentários para operações relacionadas aos comentários de produtos.
 * Rotas: postMapping para criar comentário, getMapping para listar comentários de um produto, deleteMapping para deletar comentário.
 * @Authentication para obter o usuário logado e verificar permissões (admin ou dono do comentário).
 * @return ResponseEntity com os dados apropriados ou status HTTP.
 */
@RestController
@RequestMapping("/api/comments")
public class ProductCommentController {

    private final ProductCommentService commentService;
    private final UserService userService;

    public ProductCommentController(ProductCommentService commentService, UserService userService) {
        this.commentService = commentService;
        this.userService = userService;
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<ProductCommentResponseDto> createComment(
            @PathVariable Long productId,
            @RequestBody ProductCommentRequestDto requestDto,
            Authentication authentication) {

        String email = authentication.getName();
        User user = userService.findEntityByEmail(email);

        ProductComment comment = new ProductComment();
        comment.setProductId(productId);
        comment.setUserId(user.getId());
        comment.setComment(requestDto.getComment());

        ProductComment saved = commentService.createComment(comment);

        ProductCommentResponseDto dto = ProductCommentResponseDto.fromEntity(saved);
        dto.setUserName(user.getName() + " " + user.getLastName());
        dto.setCreatedAt(saved.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductCommentResponseDto>> getComments(@PathVariable Long productId) {
        List<ProductCommentResponseDto> dtos = commentService.getCommentsByProduct(productId)
                .stream()
                .map(comment -> {
                    ProductCommentResponseDto dto = ProductCommentResponseDto.fromEntity(comment);
                    User user = userService.findByIdEntity(comment.getUserId());
                    dto.setUserName(user.getName() + " " + user.getLastName());
                    dto.setCreatedAt(comment.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId, Authentication authentication) {
        ProductComment comment = commentService.getCommentById(commentId);

        String email = authentication.getName();
        User user = userService.findEntityByEmail(email);

        boolean isAdmin = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN"));

        if (isAdmin || comment.getUserId().equals(user.getId())) {
            commentService.deleteComment(commentId);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(403).build();
        }
    }
}
