package com.example.demo.auth.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.auth.domain.Store;
import com.example.demo.auth.domain.User;

/**
 * Repositório para operações de banco de dados relacionadas a lojas.
 */
public interface StoreRepository extends  JpaRepository<Store, Long> {
    List<Store> findByOwnerId(User owner);
    List<Store> findByOwner(User owner);
}
