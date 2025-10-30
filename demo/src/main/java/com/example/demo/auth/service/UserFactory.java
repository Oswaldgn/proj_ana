package com.example.demo.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.demo.auth.domain.Role;
import com.example.demo.auth.domain.User;
import com.example.demo.auth.dto.UserRequestDto;

/**
 * Interface para a criação de objetos User a partir de UserRequestDto.
 * Fornece um método estático para construir uma entidade User.
 * @param createUser Método para criar um usuário a partir de UserRequestDto e PasswordEncoder.
 */
public class UserFactory {
    private UserFactory() {}

    public static User createUser(UserRequestDto dto, PasswordEncoder encoder) {
        if (dto == null) {
            throw new IllegalArgumentException("UserRequestDto não pode ser nulo");
        }

        return User.builder()
                .email(dto.getEmail())
                .password(encoder.encode(dto.getPassword()))
                .name(dto.getName())
                .lastName(dto.getLastName())
                .cpf(dto.getCpf())
                .phone(dto.getPhone()) 
                .role(dto.getRole() != null ? dto.getRole() : Role.USER)
                .build(); 
    }
}
