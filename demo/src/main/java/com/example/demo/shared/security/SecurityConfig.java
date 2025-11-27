package com.example.demo.shared.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * Configurações de segurança para a aplicação.
 * Define regras de autorização, autenticação e CORS.
 * Utiliza JWT para autenticação.
 * Configura filtros de segurança.
 * Configura permissões baseadas em roles para diferentes endpoints.
 * @param jwtAuthenticationFilter Filtro de autenticação JWT.
 * @return Configuração de segurança da aplicação.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
        .authorizeHttpRequests(auth -> auth

            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

            .requestMatchers("/api/auth/**", "/api/users/register", "/api/users/login").permitAll()

            // Ratings
            .requestMatchers(HttpMethod.GET, "/api/products/*/rating").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/products/*/rating").hasAnyRole("USER", "ADMIN")

            // Produtos públicos
            .requestMatchers(HttpMethod.GET, "/api/store/public/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/products/store/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/product/public/**").permitAll()

            // Produtos CRUD
            .requestMatchers(HttpMethod.POST, "/api/products/**").authenticated()
            .requestMatchers(HttpMethod.PUT, "/api/products/**").authenticated()
            .requestMatchers(HttpMethod.DELETE, "/api/products/**").authenticated()

            // Comentários
            .requestMatchers(HttpMethod.GET, "/api/comments/product/**").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/comments/product/**").hasAnyRole("USER", "ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/comments/**").authenticated() 

            // Usuários
            .requestMatchers("/api/users/me").hasAnyRole("USER", "ADMIN")
            .requestMatchers("/api/users/**").hasRole("ADMIN")

            // Lojas
            .requestMatchers("/api/store/my").hasAnyRole("USER", "ADMIN")
            .requestMatchers("/api/store/**").hasAnyRole("USER", "ADMIN")

            // Tags de produtos
            .requestMatchers(HttpMethod.GET, "/api/tags/product/**").permitAll() // consultar tags de um produto
            .requestMatchers(HttpMethod.POST, "/api/tags/product/**").hasAnyRole("USER", "ADMIN") // adicionar tags
            .requestMatchers(HttpMethod.DELETE, "/api/tags/**").authenticated() // remover tags
            .requestMatchers(HttpMethod.GET, "/api/products").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/tags/all").permitAll()


            .anyRequest().authenticated()
        )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedHeaders(List.of("Origin", "Content-Type", "Accept", "Authorization"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
