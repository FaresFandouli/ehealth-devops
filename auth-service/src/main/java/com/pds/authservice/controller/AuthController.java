package com.pds.authservice.controller;

import com.pds.authservice.dto.*;
import com.pds.authservice.service.AuthService;
import com.pds.authservice.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    /**
     * Enregistrer un nouvel utilisateur
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Connexion utilisateur
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.warn("Tentative de connexion échouée pour: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Email ou mot de passe invalide"));
        }
    }

    /**
     * Vérifier l'email
     * POST /api/auth/verify-email
     */
    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        try {
            authService.verifyEmail(request);
            return ResponseEntity.ok(new MessageResponse("Email vérifié avec succès"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Demander une réinitialisation de mot de passe
     * POST /api/auth/forgot-password
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            authService.requestPasswordReset(email);
            return ResponseEntity.ok(new MessageResponse(
                "Un email avec un nouveau mot de passe a été envoyé à votre adresse"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Confirmer la réinitialisation du mot de passe
     * POST /api/auth/reset-password
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword) {
        try {
            authService.confirmPasswordReset(token, newPassword);
            return ResponseEntity.ok(new MessageResponse("Mot de passe réinitialisé avec succès"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Récupérer le profil utilisateur
     * GET /api/auth/profile
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            String email = authentication.getName();
            AuthResponse response = authService.getProfile(email);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Renouveler le token
     * POST /api/auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            String email = jwtService.extractEmail(request.getRefreshToken());
            String newToken = authService.getProfile(email).getToken();
            return ResponseEntity.ok(new TokenResponse(newToken));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Token invalide"));
        }
    }

    /**
     * Déconnexion
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(Authentication authentication) {
        // Pas de stockage de tokens côté serveur, donc juste confirmer la déconnexion
        log.info("Utilisateur déconnecté: {}", authentication.getName());
        return ResponseEntity.ok(new MessageResponse("Déconnexion réussie"));
    }

    /**
     * Health check
     * GET /api/auth/health
     */
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(new MessageResponse("Auth service is running"));
    }
}

