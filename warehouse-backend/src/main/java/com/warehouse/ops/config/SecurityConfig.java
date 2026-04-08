package com.warehouse.ops.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    /** When true (dev profile), all API endpoints are publicly accessible. */
    @Value("${warehouse.dev.auth-disabled:false}")
    private boolean authDisabled;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .headers(h -> h.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable)) // allow H2 console iframe
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        if (authDisabled) {
            // Dev/demo mode: allow everything without authentication
            http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        } else {
            http.cors(org.springframework.security.config.Customizer.withDefaults());
            http.authorizeHttpRequests(auth -> auth
                // Always permit CORS preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/health").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/api/users/**", "/api/roles/**").hasAnyRole("Admin")
                .requestMatchers(HttpMethod.POST, "/api/locations/**", "/api/categories/**")
                    .hasAnyRole("Admin")
                .requestMatchers(HttpMethod.PUT, "/api/locations/**", "/api/categories/**")
                    .hasAnyRole("Admin")
                .requestMatchers("/api/adjustments/**")
                    .hasAnyRole("Supervisor", "OpsManager", "Admin")
                .requestMatchers("/api/**").authenticated()
                .anyRequest().permitAll()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        }

        return http.build();
    }
}
