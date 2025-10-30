package com.example.demo.auth.dto;

import lombok.Data;

/**
 * DTO para transferir os dados de login.
 */
@Data
public class LoginRequestDto {
    private String email;
    private String password;
}
