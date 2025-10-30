package com.example.demo.auth.dto;

import com.example.demo.auth.domain.Role;
import com.example.demo.auth.domain.User;

import lombok.Data;

/**
 * Data Transfer Object para respostas contendo informações do usuário.
 */
@Data
public class UserResponseDto {
    private Long id;
    private String email;
    private String name;
    private String lastName;
    private String cpf;
    private String phone;
    private Role role;

    public static UserResponseDto fromEntity(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setLastName(user.getLastName());
        dto.setCpf(user.getCpf());
        dto.setPhone(user.getPhone());  
        dto.setRole(user.getRole());
        return dto;
    }
}
