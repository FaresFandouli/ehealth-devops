# 🔐 Authentification Custom sans Keycloak - Implémentation Complète

## ✅ Résumé des changements

### **Qu'est-ce qui a été supprimé?**
- ❌ Keycloak (OAuth2 complexe)
- ❌ Configuration OAuth2 Resource Server
- ❌ Dépendance sur Keycloak pour la gestion des users

### **Qu'est-ce qui a été ajouté?**

#### **Backend (Spring Boot - Auth Service)**

1. **Entités JPA** (`entity/`)
   - `User.java` - Utilisateurs avec tous les champs
   - `UserRole.java` - Enum (PATIENT, DOCTOR, ADMIN, etc.)
   - `EmailVerification.java` - Tokens de vérification d'email
   - `PasswordReset.java` - Tokens de réinitialisation

2. **Services**
   - `EmailService.java` - Envoi d'emails HTML (inscription, vérification, RDV, réinitialisation)
   - `JwtService.java` - Génération et validation JWT custom
   - `AuthService.java` - Logique métier (register, login, verify email, reset password)

3. **Contrôleurs**
   - `AuthController.java` - Tous les endpoints REST (register, login, verify-email, forgot-password, etc.)

4. **Configuration**
   - `SecurityConfig.java` - JWT au lieu d'OAuth2
   - `application.yml` - Configuration email SMTP, JWT, Eureka

5. **Dépendances Maven**
   - `spring-boot-starter-mail` - Envoi d'emails
   - `jjwt` - JWT tokens
   - `BCrypt` - Hashage des mots de passe

#### **Frontend (React)**

1. **Composants Auth**
   - `Register.jsx` - Page d'inscription
   - `VerifyEmail.jsx` - Page de vérification d'email
   - Améliorations au `Login.jsx`

2. **Services API**
   - `auth.api.js` - Méthodes pour register, login, verify-email, forgot-password

3. **Routes**
   - `/register` - Inscription
   - `/verify-email?token=XXX` - Vérification d'email
   - `/login` - Connexion

## 📧 Flux de l'authentification

### **1. Inscription utilisateur**
```
User remplit le formulaire (email, nom, prénom, rôle, etc.)
                ↓
Frontend POST /api/auth/register
                ↓
Backend crée l'utilisateur avec mot de passe hashé BCrypt
Backend génère token de vérification (valide 24h)
                ↓
Backend envoie 2 emails:
   📧 Email 1: "Bienvenue - Voici votre mot de passe temporaire"
   📧 Email 2: "Confirmez votre email - Cliquez sur ce lien"
                ↓
Frontend affiche succès et redirige vers login
```

### **2. Connexion avec mot de passe temporaire**
```
User ouvre le formulaire de login
User entre son email et le mot de passe temporaire reçu
                ↓
Frontend POST /api/auth/login
                ↓
Backend vérifie les credentials
Backend génère JWT + refresh token
                ↓
Frontend stocke les tokens dans localStorage
Frontend redirige vers le dashboard
```

### **3. Vérification d'email**
```
User clique sur le lien dans l'email
Le lien contient: /verify-email?token=ABC123XYZ
                ↓
Frontend appelle POST /api/auth/verify-email
Backend valide le token
Backend marque l'utilisateur comme "emailVerified=true"
                ↓
User peut accéder à toutes les fonctionnalités
```

### **4. Réinitialisation de mot de passe**
```
User clique "Mot de passe oublié"
User entre son email
                ↓
Frontend POST /api/auth/forgot-password?email=user@example.com
                ↓
Backend génère un nouveau mot de passe temporaire
                ↓
📧 Backend envoie email avec le nouveau mot de passe
                ↓
User se reconnecte avec le nouveau mot de passe temporaire
```

## 🔑 Endpoints API

### **Auth Service (`/api/auth`)**

| Méthode | Endpoint | Description | Public |
|---------|----------|-------------|--------|
| POST | `/register` | S'inscrire | ✅ Oui |
| POST | `/login` | Se connecter | ✅ Oui |
| POST | `/verify-email` | Vérifier son email | ✅ Oui |
| POST | `/forgot-password` | Demander réinitialisation | ✅ Oui |
| POST | `/reset-password` | Confirmer réinitialisation | ✅ Oui |
| GET | `/profile` | Obtenir son profil | ❌ Auth requis |
| POST | `/refresh` | Renouveler le token | ✅ Oui |
| POST | `/logout` | Se déconnecter | ❌ Auth requis |

## 📧 Configuration Gmail SMTP

### **Étapes de configuration**

1. **Activer 2FA sur le compte Gmail**
   - Allez sur https://myaccount.google.com/security
   - Activez l'authentification à 2 facteurs

2. **Générer un mot de passe d'application**
   - https://myaccount.google.com/apppasswords
   - Sélectionnez "Mail" et "Windows"
   - Copiez le mot de passe généré (format: `xxxx xxxx xxxx xxxx`)

3. **Créer le fichier `.env`** dans `auth-service/`:
```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre-email@gmail.com
MAIL_PASSWORD=xxxx xxxx xxxx xxxx
MAIL_FROM=noreply@pds-health.com
JWT_SECRET=your-very-secret-key-at-least-256-bits
FRONTEND_URL=http://localhost:5173
```

4. **Ne pas commiter le `.env`** (ajouter à `.gitignore`)

## 🗄️ Schéma de base de données

### **Table `users`**
```
id (BIGINT)
email (VARCHAR) - UNIQUE
first_name (VARCHAR)
last_name (VARCHAR)
password (VARCHAR) - Hashé BCrypt
role (ENUM) - PATIENT, DOCTOR, ADMIN, etc.
email_verified (BOOLEAN) - Par défaut FALSE
active (BOOLEAN) - Par défaut TRUE
phone (VARCHAR)
address (VARCHAR)
city (VARCHAR)
zip_code (VARCHAR)
date_of_birth (VARCHAR)
gender (VARCHAR)
avatar (LONGTEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
last_login (TIMESTAMP)
```

### **Table `email_verifications`**
```
id (BIGINT)
user_id (BIGINT) - FK users
token (VARCHAR) - UNIQUE
expires_at (TIMESTAMP) - 24h après création
verified_at (TIMESTAMP) - NULL jusqu'à vérification
used (BOOLEAN) - Par défaut FALSE
created_at (TIMESTAMP)
```

### **Table `password_resets`**
```
id (BIGINT)
user_id (BIGINT) - FK users
token (VARCHAR) - UNIQUE
temp_password (VARCHAR)
expires_at (TIMESTAMP) - 24h
used_at (TIMESTAMP) - NULL jusqu'à utilisation
used (BOOLEAN) - Par défaut FALSE
created_at (TIMESTAMP)
```

## 🎨 Templates d'emails

### **Email 1: Inscription**
```
Objet: Bienvenue sur PDS Health - Activez votre compte

Contenu:
- Bienvenue [First Name] [Last Name]
- Votre compte a été créé
- Email: [EMAIL]
- Mot de passe temporaire: [TEMP_PASSWORD] (copie)
- Instructions: Se connecter → Vérifier email → Vous pouvez modifier mot de passe
```

### **Email 2: Vérification d'email**
```
Objet: Confirmez votre adresse email

Contenu:
- Bonjour [First Name]
- Merci de vous être inscrit(e)
- Cliquez sur ce bouton pour confirmer: [VERIFICATION_LINK]
- Le lien expire dans 24 heures
```

### **Email 3: Réinitialisation de mot de passe**
```
Objet: Réinitialisation de votre mot de passe

Contenu:
- Bonjour [First Name]
- Votre nouveau mot de passe temporaire: [TEMP_PASSWORD]
- Instructions: Connectez-vous → Changez immédiatement le mot de passe
- ⚠️ Si vous n'avez pas demandé ceci, changez votre mot de passe!
```

### **Email 4: Confirmation de rendez-vous** (future enhancement)
```
Objet: Confirmation de votre rendez-vous

Contenu:
- Bonjour [Patient First Name]
- Rendez-vous confirmé
- 📅 Date/Heure: [APPOINTMENT_DATETIME]
- 👨‍⚕️ Docteur: [DOCTOR_NAME]
- Conseils: Arrivez 10 min avant, apportez documents assurance
```

## 📱 Frontend Routes

```
/login               → Page de connexion
/register            → Page d'inscription
/verify-email?token=XXX → Vérification d'email
/dashboard           → Tableau de bord (protégé)
/patients            → Gestion des patients (rôle DOCTOR/ADMIN)
/appointments        → Gestion RDV
/consultations       → Gestion consultations
```

## 🔒 Sécurité

### **Bonnes pratiques implémentées**

✅ **Hashage des mots de passe**
- BCryptPasswordEncoder - 10 rounds
- Jamais stocker les mots de passe en clair

✅ **JWT Tokens**
- Signature HS256
- Expiration 24h (tokens d'accès)
- Expiration 7j (refresh tokens)
- Changeable via configuration

✅ **Tokens de vérification**
- UUID aléatoires
- Expiration 24h
- One-time use (marqués comme `used=true`)

✅ **Email Verification**
- Tokens uniques
- Expiration courte
- Validation stricte

✅ **CORS**
- Configuré pour http://localhost:5173
- À adapter en production

✅ **Rate Limiting** (future)
- À implémenter pour prévenir brute force

## 🚀 Déploiement

### **Développement**
```bash
# 1. Configurer le fichier .env
cp auth-service/.env.example auth-service/.env
# Éditer et remplir les variables

# 2. Démarrer le service
cd auth-service
mvn spring-boot:run

# 3. Vérifier que le service est actif
curl http://localhost:8082/api/auth/health
```

### **Production**
```bash
# 1. Définir les variables d'environnement
export MAIL_USERNAME=prod@gmail.com
export MAIL_PASSWORD=app-password
export JWT_SECRET=long-secret-key-256-bits
export FRONTEND_URL=https://yourdomain.com

# 2. Build et run
mvn clean package -DskipTests
java -jar target/auth-service-1.0.0.jar
```

## 📋 Checklist de mise en place

### **Backend**
- [ ] MySQL démarré (port 3306)
- [ ] Fichier `.env` créé et configuré
- [ ] Dépendances Maven téléchargées
- [ ] Service auth-service démarre (port 8082)
- [ ] Endpoints accessibles (POST /api/auth/register, etc.)
- [ ] Emails s'envoient (tester avec un email de test)

### **Frontend**
- [ ] Routes /register, /verify-email ajoutées
- [ ] Composants Register.jsx et VerifyEmail.jsx créés
- [ ] API auth.api.js mise à jour
- [ ] Lien d'inscription visible sur la page login
- [ ] Inscriptions et vérifications fonctionnent

### **Test complet**
- [ ] 1. S'inscrire via /register
- [ ] 2. Recevoir email avec mot de passe temporaire
- [ ] 3. Se connecter avec le mot de passe temporaire
- [ ] 4. Recevoir email de vérification
- [ ] 5. Cliquer sur le lien de vérification
- [ ] 6. Email marqué comme verified
- [ ] 7. Dashboard accessible

## 🐛 Troubleshooting

| Problème | Cause | Solution |
|----------|-------|----------|
| Les emails ne s'envoient pas | Variables d'env manquantes | Vérifier MAIL_USERNAME, MAIL_PASSWORD |
| 401 Unauthorized | JWT invalide/expiré | Vérifier le token, la clé secrète JWT |
| Email déjà utilisé | Duplicate entry | Utiliser un email différent |
| Token expiré | Plus de 24h | Faire une nouvelle inscription |
| CORS error | Frontend non autorisé | Ajouter le domaine dans SecurityConfig |

## 📚 Ressources

- [Documentation JWT](https://github.com/jwtk/jjwt)
- [Spring Mail](https://spring.io/guides/gs/sending-email/)
- [Spring Security](https://spring.io/projects/spring-security)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)

## 🎯 Prochaines améliorations

1. **Notifications en temps réel**
   - WebSocket pour les confirmations RDV
   - Notification push pour les rappels

2. **OAuth2 Social Login**
   - Connexion via Google/GitHub/Microsoft
   - Synchronisation avec PDS

3. **2FA (Two-Factor Authentication)**
   - SMS OTP
   - Authenticator app (Google Authenticator)

4. **Email Audit**
   - Logs de tous les emails envoyés
   - Tentatives failed tracking

5. **Advanced Security**
   - Rate limiting par IP
   - Détection anomalies login
   - Révocation de tokens

---

**Status**: ✅ Implémentation complète
**Keycloak**: ❌ Supprimé
**Emails**: ✅ Opérationnels
**JWT**: ✅ Custom implementé
**Frontend**: ✅ Inscription et vérification
