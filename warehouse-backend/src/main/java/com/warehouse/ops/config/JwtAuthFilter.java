package com.warehouse.ops.config;

import com.warehouse.ops.entity.Role;
import com.warehouse.ops.entity.User;
import com.warehouse.ops.repository.UserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Validates Supabase-issued JWTs on every request.
 * In dev mode (warehouse.dev.auth-disabled=true), reads an X-Demo-User-Email
 * header instead so the frontend can pass a demo identity without real auth.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    @Value("${supabase.jwt.secret:dev-secret}")
    private String jwtSecret;

    @Value("${warehouse.dev.auth-disabled:false}")
    private boolean authDisabled;

    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        if (authDisabled) {
            // In dev mode: read X-Demo-User-Email header set by the frontend
            String email = request.getHeader("X-Demo-User-Email");
            if (email == null) email = "admin@warehouse.demo"; // default to admin
            authenticateByEmail(email);
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        try {
            Claims claims = Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseSignedClaims(token)
                .getPayload();

            String email = claims.get("email", String.class);
            if (email != null) authenticateByEmail(email);
        } catch (JwtException e) {
            log.debug("JWT validation failed: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private void authenticateByEmail(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            String roleName = user.getRole().getName();
            UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                    user, null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + roleName))
                );
            SecurityContextHolder.getContext().setAuthentication(auth);
        });
    }
}
