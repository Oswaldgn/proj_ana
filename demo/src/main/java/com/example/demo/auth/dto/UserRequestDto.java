package com.example.demo.auth.dto;

import com.example.demo.auth.domain.Role;

import lombok.Data;

/**
 * Data Transfer Object para requisições de criação ou atualização de usuário.
 */
@Data
public class UserRequestDto {
    private String email;
    private String password;
    private String name;
    private String lastName;
    private String cpf;
    private String phone; 
    private Role role;
}
