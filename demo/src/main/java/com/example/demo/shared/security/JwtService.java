package com.example.demo.shared.security;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;

/**
 * Serviço para geração e validação de tokens JWT.
 * Inclui métodos para extrair informações do token, gerar novos tokens e validar tokens existentes.
 * @param extractUsername Método para extrair o nome de usuário (email) do token JWT.
 * @param generateToken Método para gerar um token JWT para um dado nome de usuário.
 * @param isTokenValid Método para validar se um token JWT é válido para um dado nome de usuário.
 * @param validateToken Método para validar a integridade e validade do token JWT.
 * @param JwtService Construtor que inicializa a chave de assinatura e o tempo de expiração do token a partir de variáveis de ambiente.
 */
@Service
public class JwtService {

    private final Key signingKey;
    private final long EXPIRATION_TIME; 

    public JwtService() {
        Dotenv dotenv = Dotenv.configure()
                              .ignoreIfMissing()
                              .load();

        String secretFromEnv = dotenv.get("SECRET_KEY");

        SecretKey key;
        if (secretFromEnv == null || Base64.getDecoder().decode(secretFromEnv).length < 32) {
            System.out.println("WARNING: SECRET_KEY inválida ou menor que 32 bytes. Gerando chave aleatória segura.");
            key = Keys.secretKeyFor(SignatureAlgorithm.HS256); 
        } else {
            byte[] keyBytes = Base64.getDecoder().decode(secretFromEnv);
            key = Keys.hmacShaKeyFor(keyBytes);
        }

        this.signingKey = key;

        String expTime = dotenv.get("EXPIRATION_TIME");
        this.EXPIRATION_TIME = (expTime != null) ? Long.parseLong(expTime) : 86400000; 
    }

    private Key getSignInKey() {
        return signingKey;
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException | MalformedJwtException | UnsupportedJwtException | SignatureException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean isTokenValid(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username)) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
