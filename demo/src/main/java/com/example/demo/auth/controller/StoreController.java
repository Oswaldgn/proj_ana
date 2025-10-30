package com.example.demo.auth.controller;

import java.nio.file.AccessDeniedException;
import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.auth.domain.User;
import com.example.demo.auth.dto.StoreRequestDto;
import com.example.demo.auth.dto.StoreResponseDto;
import com.example.demo.auth.repository.UserRepository;
import com.example.demo.auth.service.StoreService;

/**
 * Controle de lojas. Responsável por lidar com as rotas relacionadas às operações de loja.
 * @param storeService Serviço de loja para operações relacionadas às lojas.
 * @param userRepository Repositório de usuários para validação de permissões.
 * @param createStore Método para criar uma nova loja.
 * @param updateStore Método para atualizar uma loja existente.
 * @param deleteStore Método para deletar uma loja existente.
 * @param findAll Método para listar todas as lojas.
 * @param findById Método para buscar uma loja por ID.
 */
@RestController
@RequestMapping("/api/store")
public class StoreController {

    private final StoreService storeService;
    private final UserRepository userRepository;

    public StoreController(StoreService storeService, UserRepository userRepository) {
        this.storeService = storeService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public StoreResponseDto createStore(@RequestBody StoreRequestDto dto, Principal principal) {
        return storeService.createStore(principal.getName(), dto);
    }

    @PutMapping("/{id}")
    public StoreResponseDto updateStore(
            @PathVariable Long id,
            @RequestBody StoreRequestDto dto,
            Principal principal
    ) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        boolean isAdmin = user.getRole().toString().equalsIgnoreCase("ADMIN");

        try {
            return storeService.updateStore(id, principal.getName(), dto, isAdmin);
        } catch (AccessDeniedException ex) {
            throw new RuntimeException("Acesso negado: " + ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void deleteStore(@PathVariable Long id, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        boolean isAdmin = user.getRole().toString().equalsIgnoreCase("ADMIN");

        try {
            storeService.deleteStore(id, principal.getName(), isAdmin);
        } catch (AccessDeniedException ex) {
            throw new RuntimeException("Acesso negado: " + ex.getMessage());
        }
    }

    @GetMapping
    public List<StoreResponseDto> findAll() {
        return storeService.findAll();
    }

    @GetMapping("/{id}")
    public StoreResponseDto findById(@PathVariable Long id) {
        return storeService.findById(id);
    }

    @GetMapping("/my")
    public List<StoreResponseDto> getMyStores(Principal principal) {
        return storeService.findMyStores(principal.getName());
    }

    @GetMapping("/public")
    public List<StoreResponseDto> getAllStoresPublic() {
        return storeService.findAllPublic();
    }

}