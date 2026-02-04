package com.pds.authservice.service;

import com.pds.authservice.dto.*;
import com.pds.authservice.entity.EmailVerification;
import com.pds.authservice.entity.PasswordReset;
import com.pds.authservice.entity.User;
import com.pds.authservice.repository.EmailVerificationRepository;
import com.pds.authservice.repository.PasswordResetRepository;
import com.pds.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final PasswordResetRepository passwordResetRepository;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     * Enregistrer un nouvel utilisateur
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }

        // Générer un mot de passe temporaire
        String tempPassword = generateTemporaryPassword();
        String hashedPassword = passwordEncoder.encode(tempPassword);

        // Créer l'utilisateur
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPassword(hashedPassword);
        user.setRole(request.getRole());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setZipCode(request.getZipCode());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setGender(request.getGender());
        user.setActive(true);
        user.setEmailVerified(false);

        User savedUser = userRepository.save(user);

        // Générer le token de vérification d'email
        String verificationToken = generateVerificationToken(savedUser);

        // Envoyer l'email d'inscription avec mot de passe temporaire
        emailService.sendRegistrationEmail(
            savedUser.getEmail(),
            savedUser.getFirstName(),
            savedUser.getLastName(),
            tempPassword
        );

        // Envoyer l'email de vérification
        emailService.sendEmailVerificationEmail(
            savedUser.getEmail(),
            savedUser.getFirstName(),
            verificationToken
        );

        // Générer les tokens
        String jwtToken = jwtService.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole().toString());
        String refreshToken = jwtService.generateRefreshToken(savedUser.getId(), savedUser.getEmail());

        return buildAuthResponse(savedUser, jwtToken, refreshToken);
    }

    /**
     * Connexion utilisateur
     */
    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Email ou mot de passe invalide");
        }

        User user = userOpt.get();

        // Vérifier le mot de passe
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email ou mot de passe invalide");
        }

        // Vérifier si l'utilisateur est actif
        if (!user.getActive()) {
            throw new RuntimeException("Ce compte est désactivé");
        }

        // Mettre à jour la date de dernière connexion
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Générer les tokens
        String jwtToken = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().toString());
        String refreshToken = jwtService.generateRefreshToken(user.getId(), user.getEmail());

        log.info("Utilisateur connecté: {}", user.getEmail());

        return buildAuthResponse(user, jwtToken, refreshToken);
    }

    /**
     * Vérifier l'email
     */
    @Transactional
    public void verifyEmail(VerifyEmailRequest request) {
        Optional<EmailVerification> verificationOpt = emailVerificationRepository.findByToken(request.getToken());

        if (verificationOpt.isEmpty()) {
            throw new RuntimeException("Token de vérification invalide");
        }

        EmailVerification verification = verificationOpt.get();

        // Vérifier l'expiration
        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Le token a expiré");
        }

        // Vérifier si déjà utilisé
        if (verification.getUsed()) {
            throw new RuntimeException("Ce token a déjà été utilisé");
        }

        // Marquer comme utilisé et verified
        verification.setUsed(true);
        verification.setVerifiedAt(LocalDateTime.now());
        emailVerificationRepository.save(verification);

        // Mettre à jour l'utilisateur
        User user = verification.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        log.info("Email vérifié pour: {}", user.getEmail());
    }

    /**
     * Demander une réinitialisation de mot de passe
     */
    @Transactional
    public void requestPasswordReset(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            // Ne pas révéler si l'email existe (sécurité)
            log.warn("Tentative de réinitialisation pour un email inexistant: {}", email);
            return;
        }

        User user = userOpt.get();

        // Générer un nouveau mot de passe temporaire
        String tempPassword = generateTemporaryPassword();
        String hashedPassword = passwordEncoder.encode(tempPassword);

        // Créer l'enregistrement de réinitialisation
        PasswordReset reset = new PasswordReset();
        reset.setUser(user);
        reset.setToken(UUID.randomUUID().toString());
        reset.setTempPassword(tempPassword);
        reset.setExpiresAt(LocalDateTime.now().plusHours(24));
        reset.setUsed(false);

        passwordResetRepository.save(reset);

        // Envoyer l'email avec le nouveau mot de passe
        emailService.sendPasswordResetEmail(
            user.getEmail(),
            user.getFirstName(),
            tempPassword
        );

        log.info("Email de réinitialisation de mot de passe envoyé à: {}", email);
    }

    /**
     * Confirmer la réinitialisation du mot de passe
     */
    @Transactional
    public void confirmPasswordReset(String token, String newPassword) {
        Optional<PasswordReset> resetOpt = passwordResetRepository.findByToken(token);

        if (resetOpt.isEmpty()) {
            throw new RuntimeException("Token de réinitialisation invalide");
        }

        PasswordReset reset = resetOpt.get();

        // Vérifier l'expiration
        if (reset.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Le token a expiré");
        }

        // Vérifier si déjà utilisé
        if (reset.getUsed()) {
            throw new RuntimeException("Ce token a déjà été utilisé");
        }

        // Mettre à jour le mot de passe
        User user = reset.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Marquer le reset comme utilisé
        reset.setUsed(true);
        reset.setUsedAt(LocalDateTime.now());
        passwordResetRepository.save(reset);

        log.info("Mot de passe réinitialisé pour: {}", user.getEmail());
    }

    /**
     * Récupérer le profil utilisateur
     */
    public AuthResponse getProfile(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Utilisateur non trouvé");
        }

        User user = userOpt.get();
        String jwtToken = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().toString());
        String refreshToken = jwtService.generateRefreshToken(user.getId(), user.getEmail());

        return buildAuthResponse(user, jwtToken, refreshToken);
    }

    /**
     * Générer un mot de passe temporaire
     */
    private String generateTemporaryPassword() {
        return UUID.randomUUID().toString().substring(0, 12);
    }

    /**
     * Générer un token de vérification d'email
     */
    private String generateVerificationToken(User user) {
        String token = UUID.randomUUID().toString();

        EmailVerification verification = new EmailVerification();
        verification.setUser(user);
        verification.setToken(token);
        verification.setExpiresAt(LocalDateTime.now().plusHours(24));
        verification.setUsed(false);

        emailVerificationRepository.save(verification);

        return token;
    }

    /**
     * Construire la réponse d'authentification
     */
    private AuthResponse buildAuthResponse(User user, String jwtToken, String refreshToken) {
        return AuthResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .role(user.getRole())
            .token(jwtToken)
            .refreshToken(refreshToken)
            .avatar(user.getAvatar())
            .emailVerified(user.getEmailVerified())
            .build();
    }
}
