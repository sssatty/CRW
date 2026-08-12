package com.crw.backend.config;

import com.crw.backend.security.JwtAuthenticationFilter;
import com.crw.backend.security.RestAuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Central security configuration.
 * <p>
 * Public endpoints are declared explicitly via {@link #PUBLIC_ENDPOINTS} so
 * that new workspace-scoped features are protected by default and have to
 * opt in to being public, rather than the other way around.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private static final String[] PUBLIC_ENDPOINTS = {
            "/api/v1/auth/**",
            "/api/v1/health",
            "/h2-console/**"
    };

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final RestAuthenticationEntryPoint restAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.ignoringRequestMatchers(publicMatchers()))
                .headers(this::configureHeaders)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(restAuthenticationEntryPoint))
                .authorizeHttpRequests(this::configureAuthorization)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private void configureHeaders(
            org.springframework.security.config.annotation.web.configurers.HeadersConfigurer<HttpSecurity> headers) {
        // H2 console renders inside a frame; same-origin framing keeps clickjacking
        // protection everywhere else in the app.
        headers.frameOptions(frameOptions -> frameOptions.sameOrigin());
    }

    private void configureAuthorization(
            org.springframework.security.config.annotation.web.configurers
                    .AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry auth) {
        auth.requestMatchers(publicMatchers()).permitAll();

        // Workspace-scoped feature areas: all require an authenticated member.
        // Fine-grained per-workspace membership checks happen in
        // WorkspaceAccessGuard once the request reaches the controller layer.
        auth.requestMatchers(new AntPathRequestMatcher("/api/v1/workspaces/**")).authenticated();
        auth.requestMatchers(new AntPathRequestMatcher("/api/v1/tasks/**")).authenticated();
        auth.requestMatchers(new AntPathRequestMatcher("/api/v1/literature/**")).authenticated();
        auth.requestMatchers(new AntPathRequestMatcher("/api/v1/manuscripts/**")).authenticated();
        auth.requestMatchers(new AntPathRequestMatcher("/api/v1/meetings/**")).authenticated();
        auth.requestMatchers(new AntPathRequestMatcher("/api/v1/chat/**")).authenticated();

        auth.requestMatchers(new AntPathRequestMatcher("/api/v1/**")).authenticated();
        auth.anyRequest().authenticated();
    }

    private RequestMatcher[] publicMatchers() {
        return Arrays.stream(PUBLIC_ENDPOINTS)
                .map(AntPathRequestMatcher::new)
                .collect(Collectors.toList())
                .toArray(new RequestMatcher[0]);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
