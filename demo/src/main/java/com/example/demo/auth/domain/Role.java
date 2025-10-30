package com.example.demo.auth.domain;

/**
 * Enumeração que representa os papéis (roles) disponíveis no sistema.
 * Contém dois papéis: ADIMIN e USER.
 * Utilizado para definir o nível de acesso dos usuários no sistema.
 * @param ADIMIN Papel de administrador com privilégios elevados.
 * @param USER Papel de usuário comum com privilégios limitados.
 */
public enum Role {
    ADMIN,
    USER
}
