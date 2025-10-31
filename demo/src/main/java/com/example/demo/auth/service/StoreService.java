package com.example.demo.auth.service;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.demo.auth.domain.Store;
import com.example.demo.auth.domain.User;
import com.example.demo.auth.dto.StoreRequestDto;
import com.example.demo.auth.dto.StoreResponseDto;
import com.example.demo.auth.repository.StoreRepository;
import com.example.demo.auth.repository.UserRepository;

import jakarta.transaction.Transactional;

/**
 * Serviço para gerenciar operações relacionadas a lojas.
 * Inclui criação, atualização, exclusão e recuperação de lojas.
 * Assegura que apenas proprietários ou administradores possam modificar ou deletar lojas.
 * @param createStore Método para criar uma nova loja.
 * @param updateStore Método para atualizar uma loja existente.
 * @param deleteStore Método para deletar uma loja.
 * @param findAll Método para listar todas as lojas.
 * @param findById Método para buscar uma loja por ID.
 */
@Service
public class StoreService {

    private final StoreRepository storeRepository;
    private final UserRepository userRepository;

    public StoreService(StoreRepository storeRepository, UserRepository userRepository) {
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public StoreResponseDto createStore(String userEmail, StoreRequestDto dto) {
        User owner = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        Store store = Store.builder()
                .name(dto.getName())
                .address(dto.getAddress())
                .contact(dto.getContact())
                .imageUrl(dto.getImageUrl())
                .description(dto.getDescription())
                .owner(owner)
                .build();

        storeRepository.save(store);
        return StoreResponseDto.fromEntity(store);
    }

    @Transactional
    public StoreResponseDto updateStore(Long id, String userEmail, StoreRequestDto dto, boolean isAdmin) throws AccessDeniedException {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Loja não encontrada"));

        if (!isAdmin && !store.getOwner().getEmail().equals(userEmail)) {
            throw new AccessDeniedException("Você só pode editar suas próprias lojas");
        }

        if (dto.getName() != null) store.setName(dto.getName());
        if (dto.getAddress() != null) store.setAddress(dto.getAddress());
        if (dto.getContact() != null) store.setContact(dto.getContact());
        if (dto.getImageUrl() != null) store.setImageUrl(dto.getImageUrl());
        if (dto.getDescription() != null) store.setDescription(dto.getDescription());

        storeRepository.save(store);
        return StoreResponseDto.fromEntity(store);
    }

    @Transactional
    public void deleteStore(Long id, String userEmail, boolean isAdmin) throws AccessDeniedException {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Loja não encontrada"));

        if (!isAdmin && !store.getOwner().getEmail().equals(userEmail)) {
            throw new AccessDeniedException("Você só pode deletar suas próprias lojas");
        }

        storeRepository.delete(store);
    }

    public List<StoreResponseDto> findAll() {
        return storeRepository.findAll().stream()
                .map(StoreResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public StoreResponseDto findById(Long id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Loja não encontrada"));
        return StoreResponseDto.fromEntity(store);
    }

    @Transactional
    public List<StoreResponseDto> findMyStores(String userEmail) {
        User owner = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        List<Store> stores = storeRepository.findByOwner(owner);

        return stores.stream()
                .map(StoreResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<StoreResponseDto> findAllPublic() {
        return storeRepository.findAll().stream()
                .map(store -> StoreResponseDto.builder()
                        .id(store.getId())
                        .name(store.getName())
                        .address(store.getAddress())
                        .contact(store.getContact())
                        .imageUrl(store.getImageUrl())
                        .description(store.getDescription())
                        .ownerEmail(null) // não expõe email do dono
                        .build()
                )
                .collect(Collectors.toList());
    }

    @Transactional
    public StoreResponseDto findByIdPublic(Long id) {
        Store store = storeRepository.findById(id).orElse(null);
        if (store == null) return null;

        return StoreResponseDto.builder()
                .id(store.getId())
                .name(store.getName())
                .address(store.getAddress())
                .contact(store.getContact())
                .imageUrl(store.getImageUrl())
                .description(store.getDescription())
                .ownerEmail(null) 
                .build();
    }


}