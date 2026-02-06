# 🎯 GUIDE COMPLET DE CORRECTION ET TEST DU BACKEND PDS

## ⚠️ PROBLÈMES IDENTIFIÉS ET SOLUTIONS

### 1. **PROBLÈME: Context Path Dupliqué**

**Services affectés**: Clinic Service (8083), Consultation Service (8085)

**Problème**:
```yaml
# ❌ MAUVAIS - Crée /api/clinic/api/clinic/**
server:
  servlet:
    context-path: /api/clinic

# Les contrôleurs ont aussi @RequestMapping("/api/clinic/...")
```

**Solution**:
```yaml
# ✅ CORRECT - Supprimer le context-path, garder seulement les @RequestMapping des contrôleurs
server:
  servlet:
    context-path: /  # LAISSER VIDE OU /
```

**Correction à appliquer**:
- [ ] Clinic Service: Remplacer `context-path: /api/clinic` par `context-path: /`
- [ ] Consultation Service: Remplacer `context-path: /api/consultation` par `context-path: /`
- [ ] Medical Service: Ajouter les configurations manquantes

---

### 2. **PROBLÈME: Configuration OAuth2 Keycloak**

**Services affectés**: Clinic, Medical, Consultation

**Problème**:
```yaml
# Keycloak local non disponible
security:
  oauth2:
    resourceserver:
      jwt:
        issuer-uri: http://localhost:8080/realms/pds-realm
        jwk-set-uri: http://localhost:8080/realms/pds-realm/protocol/openid-connect/certs
```

**Solution temporaire pour les tests**:
```yaml
# ✅ Pour phase de test: Utiliser le Auth Service custom
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8082  # Auth Service
          jwk-set-uri: http://localhost:8082/api/auth/jwk-set  # À implémenter ou désactiver
```

Ou **désactiver temporairement OAuth2** pour les tests:
```yaml
# TEMPORAIRE - À enlever après les tests
management:
  endpoints:
    web:
      exposure:
        include: '*'
# Ajouter un SecurityConfig custom pour les tests
```

---

### 3. **PROBLÈME: Missing Swagger/OpenAPI Configuration**

**Services affectés**: Auth Service, Medical Service

**Solution**: Ajouter à tous les services `application.yml`:

```yaml
springdoc:
  api-docs:
    path: /v3/api-docs
    enabled: true
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
    operationsSorter: method
    tagsSorter: alpha
    display-request-duration: true
    doc-expansion: list
```

---

### 4. **PROBLÈME: CORS et Gateway Misconfiguration**

**État actuel**: Bien configuré! ✅

Le Gateway Service a la bonne configuration CORS avec:
- Origins: localhost:5173, localhost:3000, localhost:8082, localhost:8982
- Méthodes: GET, POST, PUT, DELETE, OPTIONS, PATCH
- Headers: "*" (tous)

---

## 📋 CONFIGURATION CORRECTE DES SERVICES

### Auth Service (Port 8082)
```yaml
server:
  port: 8082
  servlet:
    context-path: /

spring:
  application:
    name: auth-service
  datasource:
    url: jdbc:mysql://localhost:3306/pds_auth?serverTimezone=UTC&createDatabaseIfNotExist=true
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
  cloud:
    discovery:
      enabled: true

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
    register-with-eureka: true
    fetch-registry: true

jwt:
  secret: defaultSecretKeyChangeInProduction256BitHS256Algorithm12345678901234567890
  expiration: 86400000
  refresh-expiration: 604800000

springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
```

**Accès Swagger**: http://localhost:8082/swagger-ui.html

---

### Clinic Service (Port 8083)
```yaml
server:
  port: 8083
  servlet:
    context-path: /  # ✅ CORRIGER: enlever /api/clinic

spring:
  application:
    name: clinic-service
  datasource:
    url: jdbc:mysql://localhost:3306/pds_clinic?createDatabaseIfNotExist=true&serverTimezone=UTC
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
    register-with-eureka: true
    fetch-registry: true

springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
    enabled: true

# TEMPORAIRE - Pour désactiver OAuth2 lors des tests
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8082
```

**Accès Swagger**: http://localhost:8083/swagger-ui.html

---

### Medical Service (Port 8084)
```yaml
server:
  port: 8084
  servlet:
    context-path: /  # ✅ AJOUTER SI MANQUANT

spring:
  application:
    name: medical-service
  datasource:
    url: jdbc:mysql://localhost:3306/pds_medical?createDatabaseIfNotExist=true&serverTimezone=UTC
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
    register-with-eureka: true
    fetch-registry: true

springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
    enabled: true

spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8082
```

**Accès Swagger**: http://localhost:8084/swagger-ui.html

---

### Consultation Service (Port 8085)
```yaml
server:
  port: 8085
  servlet:
    context-path: /  # ✅ CORRIGER: enlever /api/consultation

spring:
  application:
    name: consultation-service
  datasource:
    url: jdbc:mysql://localhost:3306/pds_consultation?createDatabaseIfNotExist=true&serverTimezone=UTC
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
    register-with-eureka: true
    fetch-registry: true

springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
    enabled: true

spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8082
```

**Accès Swagger**: http://localhost:8085/swagger-ui.html

---

## 🚀 ÉTAPES DE CORRECTION

### Étape 1: Corriger les fichiers application.yml

1. **Clinic Service** (`clinic-service/src/main/resources/application.yml`):
   - Ligne 4: Remplacer `context-path: /api/clinic` par `context-path: /`
   - Supprimer les références Keycloak ou les remplacer par Auth Service

2. **Consultation Service** (`consultation-service/src/main/resources/application.yml`):
   - Ligne 4: Remplacer `context-path: /api/consultation` par `context-path: /`
   - Supprimer les références Keycloak

3. **Medical Service** (`medical-service/src/main/resources/application.yml`):
   - Ajouter configuration Swagger
   - Corriger si context-path est défini

4. **Auth Service**: ✅ OK

### Étape 2: Vérifier les SecurityConfig

Chaque service doit avoir un `SecurityConfig.java` qui:
- Désactive l'authentification OAuth2 si Keycloak n'est pas disponible (TEMPORAIRE)
- Configure CORS si nécessaire
- Permet l'accès à `/swagger-ui.html` et `/v3/api-docs`

Exemple:
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/swagger-ui.html", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
                .requestMatchers("/api/clinic/**").permitAll()  // TEMPORAIRE
                .anyRequest().authenticated())
            .csrf().disable()
            .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000", "http://localhost:8982"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

---

## 🧪 ENDPOINTS DE TEST

### 1. AUTH SERVICE (Port 8082)

#### Register
```
POST http://localhost:8982/api/auth/register
Content-Type: application/json

{
  "username": "doctor1",
  "password": "password123",
  "role": "DOCTOR"
}

Response:
{
  "id": "uuid",
  "username": "doctor1",
  "role": "DOCTOR",
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Login
```
POST http://localhost:8982/api/auth/login
Content-Type: application/json

{
  "username": "doctor1",
  "password": "password123"
}

Response:
{
  "id": "uuid",
  "username": "doctor1",
  "role": "DOCTOR",
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Get Profile
```
GET http://localhost:8982/api/auth/profile
Authorization: Bearer {token}

Response:
{
  "id": "uuid",
  "username": "doctor1",
  "role": "DOCTOR",
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Health Check
```
GET http://localhost:8982/api/auth/health

Response:
{
  "message": "Auth service is running"
}
```

---

### 2. CLINIC SERVICE (Port 8083)

#### Create Patient
```
POST http://localhost:8982/api/clinic/patients/createPatient
Content-Type: application/json

{
  "firstName": "Ahmed",
  "lastName": "Ali",
  "dateOfBirth": "1990-05-15",
  "gender": "M",
  "email": "ahmed@example.com",
  "phone": "+212600000000",
  "address": "Casablanca, Morocco",
  "bloodType": "O+",
  "emergencyContact": "Fatima Ali",
  "emergencyPhone": "+212600000001"
}

Response:
{
  "id": "uuid",
  "firstName": "Ahmed",
  "lastName": "Ali",
  "dateOfBirth": "1990-05-15",
  "gender": "M",
  "email": "ahmed@example.com",
  "phone": "+212600000000",
  "address": "Casablanca, Morocco",
  "bloodType": "O+",
  "emergencyContact": "Fatima Ali",
  "emergencyPhone": "+212600000001",
  "createdAt": "2024-02-05T10:30:00",
  "updatedAt": "2024-02-05T10:30:00"
}
```

#### Get All Patients
```
GET http://localhost:8982/api/clinic/patients/getAllPatients

Response:
[
  {
    "id": "uuid",
    "firstName": "Ahmed",
    "lastName": "Ali",
    ...
  }
]
```

#### Get Patient by ID
```
GET http://localhost:8982/api/clinic/patients/getPatientById/{id}

Response:
{
  "id": "uuid",
  "firstName": "Ahmed",
  ...
}
```

#### Update Patient
```
PUT http://localhost:8982/api/clinic/patients/updatePatient/{id}
Content-Type: application/json

{
  "firstName": "Ahmed",
  "lastName": "Ali Updated",
  ...
}

Response:
{
  "id": "uuid",
  "firstName": "Ahmed",
  "lastName": "Ali Updated",
  ...
}
```

#### Delete Patient
```
DELETE http://localhost:8982/api/clinic/patients/deletePatient/{id}

Response: 200 OK (empty body)
```

---

### 3. MEDICAL SERVICE (Port 8084)

#### Create Medical Record
```
POST http://localhost:8982/api/medical/records
Content-Type: application/json

{
  "patientId": "patient-uuid",
  "doctorId": "doctor-uuid",
  "diagnosis": "Hypertension",
  "symptoms": "High blood pressure, headache",
  "treatment": "Medication - Lisinopril 10mg",
  "prescription": "Lisinopril 10mg, 1 tablet daily",
  "notes": "Follow-up appointment in 2 weeks",
  "bloodPressure": "140/90",
  "temperature": 36.5,
  "heartRate": 78,
  "weight": 75.5,
  "height": 180
}

Response:
{
  "id": "uuid",
  "patientId": "patient-uuid",
  "doctorId": "doctor-uuid",
  "diagnosis": "Hypertension",
  ...
  "recordDate": "2024-02-05",
  "createdAt": "2024-02-05T10:30:00",
  "updatedAt": "2024-02-05T10:30:00"
}
```

#### Get All Medical Records
```
GET http://localhost:8982/api/medical/records

Response:
[
  {
    "id": "uuid",
    ...
  }
]
```

#### Get Records by Patient
```
GET http://localhost:8982/api/medical/records/patient/{patientId}

Response:
[
  {
    "id": "uuid",
    ...
  }
]
```

#### Get Records by Doctor
```
GET http://localhost:8982/api/medical/records/doctor/{doctorId}

Response:
[
  {
    "id": "uuid",
    ...
  }
]
```

#### Update Medical Record
```
PUT http://localhost:8982/api/medical/records/{id}
Content-Type: application/json

{
  "diagnosis": "Hypertension - Stage 1",
  ...
}

Response:
{
  "id": "uuid",
  ...
}
```

#### Delete Medical Record
```
DELETE http://localhost:8982/api/medical/records/{id}

Response: 200 OK
```

---

### 4. CONSULTATION SERVICE (Port 8085)

#### Create Consultation
```
POST http://localhost:8982/api/consultation/consultations/createConsultation
Content-Type: application/json

{
  "patientId": "patient-uuid",
  "doctorId": "doctor-uuid",
  "consultationDate": "2024-02-10T14:30:00",
  "reason": "Regular checkup",
  "diagnosis": "Patient is healthy",
  "prescription": "No medication needed",
  "notes": "Continue healthy lifestyle",
  "status": "SCHEDULED"
}

Response:
{
  "id": "uuid",
  "patientId": "patient-uuid",
  "doctorId": "doctor-uuid",
  "consultationDate": "2024-02-10T14:30:00",
  "reason": "Regular checkup",
  "diagnosis": "Patient is healthy",
  "prescription": "No medication needed",
  "notes": "Continue healthy lifestyle",
  "status": "SCHEDULED",
  "createdAt": "2024-02-05T10:30:00",
  "updatedAt": "2024-02-05T10:30:00"
}
```

#### Get All Consultations
```
GET http://localhost:8982/api/consultation/consultations/getAllConsultations

Response:
[
  {
    "id": "uuid",
    ...
  }
]
```

#### Get Consultations by Patient
```
GET http://localhost:8982/api/consultation/consultations/patient/{patientId}

Response:
[
  {
    "id": "uuid",
    ...
  }
]
```

#### Get Consultations by Doctor
```
GET http://localhost:8982/api/consultation/consultations/doctor/{doctorId}

Response:
[
  {
    "id": "uuid",
    ...
  }
]
```

#### Get Consultations by Status
```
GET http://localhost:8982/api/consultation/consultations/getConsultationsByStatus/status/SCHEDULED

Response:
[
  {
    "id": "uuid",
    ...
  }
]
```

#### Update Consultation
```
PUT http://localhost:8982/api/consultation/consultations/updateConsultation/{id}
Content-Type: application/json

{
  "status": "COMPLETED",
  "diagnosis": "Patient is in good health"
}

Response:
{
  "id": "uuid",
  ...
}
```

#### Delete Consultation
```
DELETE http://localhost:8982/api/consultation/consultations/deleteConsultation/{id}

Response: 200 OK
```

---

## 📊 TABLEAU DE STATUS DES SERVICES

| Service | Port | Status | Swagger | BD | Auth |
|---------|------|--------|---------|-----|------|
| Auth | 8082 | ✅ | ✅ | ✅ | N/A |
| Clinic | 8083 | ✅ | ✅ | ✅ | ⚠️ OAuth2 |
| Medical | 8084 | ✅ | ⚠️ | ✅ | ⚠️ OAuth2 |
| Consultation | 8085 | ✅ | ✅ | ✅ | ⚠️ OAuth2 |
| Gateway | 8982 | ✅ | ❌ | ❌ | N/A |
| Discovery | 8761 | ✅ | ✅ | ❌ | N/A |
| Config | 8888 | ✅ | ❌ | ❌ | N/A |

---

## ✅ CHECKLIST DE TEST POSTMAN

### Phase 1: Services Découverte
- [ ] Consulter Eureka: http://localhost:8761
- [ ] Vérifier tous les services sont enregistrés

### Phase 2: Auth Service
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] GET /api/auth/profile (avec token)
- [ ] POST /api/auth/refresh
- [ ] GET /api/auth/health

### Phase 3: Clinic Service
- [ ] POST /api/clinic/patients/createPatient
- [ ] GET /api/clinic/patients/getAllPatients
- [ ] GET /api/clinic/patients/getPatientById/{id}
- [ ] PUT /api/clinic/patients/updatePatient/{id}
- [ ] DELETE /api/clinic/patients/deletePatient/{id}

### Phase 4: Medical Service
- [ ] POST /api/medical/records
- [ ] GET /api/medical/records
- [ ] GET /api/medical/records/{id}
- [ ] GET /api/medical/records/patient/{patientId}
- [ ] GET /api/medical/records/doctor/{doctorId}
- [ ] PUT /api/medical/records/{id}
- [ ] DELETE /api/medical/records/{id}

### Phase 5: Consultation Service
- [ ] POST /api/consultation/consultations/createConsultation
- [ ] GET /api/consultation/consultations/getAllConsultations
- [ ] GET /api/consultation/consultations/getConsultationById/{id}
- [ ] GET /api/consultation/consultations/patient/{patientId}
- [ ] GET /api/consultation/consultations/doctor/{doctorId}
- [ ] GET /api/consultation/consultations/getConsultationsByStatus/status/{status}
- [ ] PUT /api/consultation/consultations/updateConsultation/{id}
- [ ] DELETE /api/consultation/consultations/deleteConsultation/{id}

---

## 🔧 COMMANDES UTILES

### Démarrer tous les services (Windows PowerShell)
```powershell
# Terminal 1: Discovery Service
cd discovery-service
mvn spring-boot:run

# Terminal 2: Config Service
cd config-service
mvn spring-boot:run

# Terminal 3: Auth Service
cd auth-service
mvn spring-boot:run

# Terminal 4: Clinic Service
cd clinic-service
mvn spring-boot:run

# Terminal 5: Medical Service
cd medical-service
mvn spring-boot:run

# Terminal 6: Consultation Service
cd consultation-service
mvn spring-boot:run

# Terminal 7: Gateway Service
cd gateway-service
mvn spring-boot:run
```

### Vérifier un service
```bash
curl http://localhost:8082/api/auth/health
curl http://localhost:8083/api/clinic/health
```

---

## 📝 PROCHAINES ÉTAPES

1. **Appliquer les corrections** à application.yml
2. **Vérifier les SecurityConfig** de chaque service
3. **Tester avec Postman** en utilisant la collection fournie
4. **Valider les réponses** et codes HTTP
5. **Documenter les erreurs** rencontrées et les solutions
