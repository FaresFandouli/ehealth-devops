# Configuration du Service d'Authentification Custom (sans Keycloak)

## Vue d'ensemble

Le nouveau système d'authentification **remplace Keycloak** par une implémentation custom avec:
- ✅ JWT tokens générés localement
- ✅ Emails d'inscription avec mot de passe temporaire
- ✅ Vérification d'email
- ✅ Réinitialisation de mot de passe par email
- ✅ Confirmations RDV par email

## Architecture

```
Frontend (React)
    ↓ (Login/Register)
API Gateway (8081)
    ↓
Auth Service (8082) - NEW
    ├─ User Service (Gestion utilisateurs)
    ├─ JWT Service (Génération tokens)
    ├─ Email Service (Envoi emails)
    └─ Database (MySQL)
```

## Configuration Gmail SMTP

### Étape 1: Activer l'authentification à 2 facteurs sur Gmail

1. Allez sur https://myaccount.google.com/
2. Allez dans "Sécurité"
3. Activez "Authentification à 2 facteurs"

### Étape 2: Générer un mot de passe d'application

1. Retournez sur https://myaccount.google.com/
2. Allez dans "Sécurité"
3. Cherchez "Mots de passe d'application"
4. Sélectionnez "Mail" et "Windows"
5. Générez un nouveau mot de passe
6. Copiez le mot de passe (format: `xxxx xxxx xxxx xxxx`)

### Étape 3: Configurer le fichier .env

Créez un fichier `.env` à la racine du projet `auth-service`:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre-email@gmail.com
MAIL_PASSWORD=xxxx xxxx xxxx xxxx
MAIL_FROM=noreply@pds-health.com
JWT_SECRET=your-very-secret-key-at-least-256-bits
FRONTEND_URL=http://localhost:5173
```

**Important**: Ne pas commiter le fichier `.env` contenant les secrets!

## Fichiers créés/modifiés

### Entités JPA (`entity/`)
- `User.java` - Entité utilisateur
- `UserRole.java` - Enum des rôles
- `EmailVerification.java` - Tokens de vérification d'email
- `PasswordReset.java` - Tokens de réinitialisation

### Repositories
- `UserRepository.java` - Accès aux utilisateurs
- `EmailVerificationRepository.java` - Gestion vérifications
- `PasswordResetRepository.java` - Gestion réinitalisations

### Services
- `EmailService.java` - Envoi d'emails HTML
- `JwtService.java` - Génération et validation JWT
- `AuthService.java` - Logique d'authentification

### Contrôleurs
- `AuthController.java` - Endpoints REST

### Configuration
- `SecurityConfig.java` - Configuration Spring Security (sans OAuth2)
- `application.yml` - Configuration de l'application

## Endpoints API

### 1. Inscription
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "patient@exemple.com",
  "firstName": "Jean",
  "lastName": "Dupont",
  "role": "PATIENT",
  "phone": "0612345678",
  "address": "123 Rue de Paris",
  "city": "Paris",
  "zipCode": "75001",
  "dateOfBirth": "1990-05-15",
  "gender": "M"
}
```

**Réponse (201)**:
```json
{
  "id": 1,
  "email": "patient@exemple.com",
  "firstName": "Jean",
  "lastName": "Dupont",
  "role": "PATIENT",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "emailVerified": false
}
```

**Action**: Un email est envoyé avec:
- Email d'inscription contenant le mot de passe temporaire
- Email de vérification contenant un lien de confirmation

### 2. Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "patient@exemple.com",
  "password": "mot-de-passe-temporaire"
}
```

**Réponse (200)**: Retourne les mêmes informations que l'inscription

### 3. Vérifier l'email
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification-token-from-email"
}
```

**Réponse (200)**:
```json
{
  "message": "Email vérifié avec succès"
}
```

### 4. Demander réinitialisation de mot de passe
```http
POST /api/auth/forgot-password?email=patient@exemple.com
```

**Réponse (200)**:
```json
{
  "message": "Un email avec un nouveau mot de passe a été envoyé à votre adresse"
}
```

**Action**: Un email est envoyé avec un nouveau mot de passe temporaire

### 5. Récupérer le profil
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

**Réponse (200)**: Infos utilisateur + token renouvelé

### 6. Renouveler le token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh-token-from-login"
}
```

**Réponse (200)**:
```json
{
  "token": "new-jwt-token"
}
```

### 7. Déconnexion
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

## Flux d'authentification complet

### 1. Inscription
```
Utilisateur rempli le formulaire
    ↓
Frontend envoie POST /api/auth/register
    ↓
Backend crée l'utilisateur avec mot de passe hashé (BCrypt)
    ↓
Backend génère token de vérification (24h)
    ↓
Backend envoie 2 emails:
   - Email d'inscription (mot de passe temporaire)
   - Email de vérification (lien de confirmation)
    ↓
Frontend reçoit JWT et refresh token
    ↓
Utilisateur se connecte avec le mot de passe temporaire
```

### 2. Vérification d'email
```
Utilisateur clique sur le lien dans l'email
    ↓
Frontend appelle POST /api/auth/verify-email?token=XXX
    ↓
Backend valide le token
    ↓
Backend marque l'email comme vérifié
    ↓
Utilisateur peut accéder à toutes les fonctionnalités
```

### 3. Réinitialisation de mot de passe
```
Utilisateur clique sur "Mot de passe oublié"
    ↓
Frontend envoie POST /api/auth/forgot-password?email=XXX
    ↓
Backend génère un nouveau mot de passe temporaire
    ↓
Backend envoie email avec le nouveau mot de passe
    ↓
Utilisateur utilise le nouveau mot de passe pour se connecter
```

## Structure des emails

### Email d'inscription
- Contient le mot de passe temporaire
- Invite à se connecter
- Explique les prochaines étapes

### Email de vérification
- Contient un lien pour confirmer l'email
- Le lien expire en 24h
- Invite à cliquer pour finaliser l'inscription

### Email de confirmation de RDV
- Contient la date/heure du RDV
- Nom du docteur
- Recommandations (arriver 10 min avant, etc.)

### Email de réinitialisation
- Contient le nouveau mot de passe temporaire
- ⚠️ Avertissement si non-demandé par l'utilisateur

## Base de données

### Table `users`
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('PATIENT', 'DOCTOR', 'ADMIN', 'SECRETARY', 'SECURITY_OFFICER'),
  email_verified BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  phone VARCHAR(20),
  address VARCHAR(255),
  city VARCHAR(100),
  zip_code VARCHAR(20),
  date_of_birth VARCHAR(50),
  gender VARCHAR(10),
  avatar LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

### Table `email_verifications`
```sql
CREATE TABLE email_verifications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Table `password_resets`
```sql
CREATE TABLE password_resets (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  temp_password VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Variables d'environnement

### Obligatoires
- `MAIL_USERNAME` - Email Gmail
- `MAIL_PASSWORD` - Mot de passe d'application Gmail
- `JWT_SECRET` - Clé secrète pour signer les JWT

### Optionnels (avec valeurs par défaut)
- `MAIL_HOST` - smtp.gmail.com
- `MAIL_PORT` - 587
- `MAIL_FROM` - noreply@pds-health.com
- `FRONTEND_URL` - http://localhost:5173

## Déploiement

### Production

1. **Variables d'environnement**:
```bash
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
export JWT_SECRET=your-256-bit-secret-key
export FRONTEND_URL=https://your-domain.com
```

2. **Construire l'application**:
```bash
cd auth-service
mvn clean package -DskipTests
java -jar target/auth-service-1.0.0.jar
```

3. **Vérifications de sécurité**:
- ✅ JWT_SECRET changé (au moins 256 bits)
- ✅ Mots de passe d'application Gmail générés
- ✅ HTTPS activé
- ✅ CORS configuré pour votre domaine
- ✅ Logs configurés correctement

## Troubleshooting

### Emails ne s'envoient pas

**Vérifiez**:
1. Les variables d'environnement sont-elles définies?
2. Le mot de passe d'application Gmail est-il correct?
3. Gmail a-t-il bloqué la connexion? (Vérifiez My Account)
4. Les logs montrent-ils une erreur spécifique?

### Token JWT invalide

**Vérifiez**:
1. La clé secrète JWT est-elle la même au login et à la vérification?
2. Le token n'est-il pas expiré?
3. Le header Authorization contient-il "Bearer "?

### Utilisateur ne peut pas se connecter

**Vérifiez**:
1. L'utilisateur existe-t-il dans la base de données?
2. Le mot de passe est-il correct?
3. L'utilisateur est-il marqué comme actif (active=true)?

## Ressources utiles

- [Spring Security JWT](https://spring.io/blog/2015/01/12/spring-and-security-form-based-login-xml-config)
- [Spring Mail](https://spring.io/guides/gs/sending-email/)
- [JJWT Documentation](https://github.com/jwtk/jjwt)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)

## Prochaines améliorations

1. **Email Notifications** - RDV, consultations, etc.
2. **2FA** - Authentification à deux facteurs
3. **OAuth2** - Connexion via Google/GitHub
4. **API Keys** - Pour les services tiers
5. **Rate Limiting** - Prévention brute force

## Support

Pour toute question sur l'authentification, consultez:
- Application logs: `logs/auth-service.log`
- Swagger: `http://localhost:8082/swagger-ui.html`
- Endpoints: `/v3/api-docs`
