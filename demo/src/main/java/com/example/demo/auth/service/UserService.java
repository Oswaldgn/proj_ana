package com.example.demo.auth.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.auth.domain.User;
import com.example.demo.auth.dto.LoginRequestDto;
import com.example.demo.auth.dto.UserRequestDto;
import com.example.demo.auth.dto.UserResponseDto;
import com.example.demo.auth.repository.UserRepository;
import com.example.demo.shared.security.JwtService;

/**
 * Serviço para gerenciar operações relacionadas a usuários.
 * Inclui registro, login, atualização de perfil, listagem e exclusão de usuários.
 * Diferencia ações permitidas para usuários comuns e administradores.
 * @param register Método para registrar um novo usuário.
 * @param login Método para autenticar um usuário e gerar um token JWT.
 * @param updateOwnProfile Método para atualizar o perfil do próprio usuário.
 * @param updateUserByAdmin Método para atualizar qualquer usuário (somente para administradores).
 * @param findAll Método para listar todos os usuários (somente para administradores).
 * @param findById Método para buscar um usuário por ID (somente para administradores).
 * @param deleteUser Método para deletar um usuário (somente para administradores).
 * @param findByEmail Método para buscar o próprio usuário pelo email.
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public UserResponseDto register(UserRequestDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        User user = UserFactory.createUser(dto, passwordEncoder);
        userRepository.save(user);

        return UserResponseDto.fromEntity(user);
    }

    public String login(LoginRequestDto dto) {
        Optional<User> optionalUser = userRepository.findByEmail(dto.getEmail());
        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }

        return jwtService.generateToken(user.getEmail());
    }

    @Transactional
    public UserResponseDto updateOwnProfile(String email, UserRequestDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getCpf() != null) user.setCpf(dto.getCpf());
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        userRepository.save(user);
        return UserResponseDto.fromEntity(user);
    }

    @Transactional
    public UserResponseDto updateUserByAdmin(Long id, UserRequestDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getCpf() != null) user.setCpf(dto.getCpf());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        userRepository.save(user);
        return UserResponseDto.fromEntity(user);
    }

    public List<UserResponseDto> findAll() {
        return userRepository.findAll()
                .stream()
                .map(UserResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public UserResponseDto findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        return UserResponseDto.fromEntity(user);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("Usuário não encontrado");
        }
        userRepository.deleteById(id);
    }

    public UserResponseDto findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado com email: " + email));
        return UserResponseDto.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public User findEntityByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado com email: " + email));
    }

    public User findByIdEntity(Long id) {
    return userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
}
}
