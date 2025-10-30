package com.example.demo.shared.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exceção personalizada para indicar que um recurso não foi encontrado. (HTTP 404)
 * @param message Mensagem detalhando o motivo da exceção.
 * @returns NotFoundException com a mensagem fornecida.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}
