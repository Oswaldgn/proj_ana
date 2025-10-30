package com.example.demo.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.auth.dto.LoginRequestDto;
import com.example.demo.auth.dto.UserRequestDto;
import com.example.demo.auth.dto.UserResponseDto;
import com.example.demo.auth.service.UserService;

/**
 * Controle de autenticação e registro de usuários. Responsável por lidar com as rotas de autenticação.
 * @param userService Serviço de usuário para operações relacionadas a autenticação.
 * @param register Método para registrar um novo usuário.
 * @param login Método para autenticar um usuário existente.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(@RequestBody UserRequestDto dto) {
        UserResponseDto response = userService.register(dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDto dto) {
        String token = userService.login(dto);
        return ResponseEntity.ok(token);
    }
}