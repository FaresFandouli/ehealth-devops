#!/usr/bin/env python3
"""Complete service generator for PDS project"""
import os

PROJECT_ROOT = "/home/claude/pds-complete-project"

def create_clinic_service():
    """Create clinic service with entities and controllers"""
    base = f"{PROJECT_ROOT}/clinic-service/src/main/java/com/pds/clinicservice"
    
    # Application
    os.makedirs(base, exist_ok=True)
    with open(f"{base}/ClinicServiceApplication.java", 'w') as f:
        f.write("""package com.pds.clinicservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ClinicServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ClinicServiceApplication.class, args);
    }
}""")
    
    # Entity
    os.makedirs(f"{base}/entity", exist_ok=True)
    with open(f"{base}/entity/Patient.java", 'w') as f:
        f.write("""package com.pds.clinicservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
@Data
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String email;
    private String phone;
    private String address;
    private String bloodType;
    private String emergencyContact;
    private String emergencyPhone;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}""")
    
    with open(f"{base}/entity/Appointment.java", 'w') as f:
        f.write("""package com.pds.clinicservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long patientId;
    private Long doctorId;
    private LocalDateTime appointmentDate;
    private Integer durationMinutes;
    private String status;
    private String reason;
    private String notes;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}""")
    
    # Repository
    os.makedirs(f"{base}/repository", exist_ok=True)
    with open(f"{base}/repository/PatientRepository.java", 'w') as f:
        f.write("""package com.pds.clinicservice.repository;

import com.pds.clinicservice.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByEmail(String email);
}""")
    
    with open(f"{base}/repository/AppointmentRepository.java", 'w') as f:
        f.write("""package com.pds.clinicservice.repository;

import com.pds.clinicservice.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
}""")
    
    # Service
    os.makedirs(f"{base}/service", exist_ok=True)
    with open(f"{base}/service/PatientService.java", 'w') as f:
        f.write("""package com.pds.clinicservice.service;

import com.pds.clinicservice.entity.Patient;
import com.pds.clinicservice.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {
    private final PatientRepository patientRepository;
    
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
    
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Patient not found"));
    }
    
    public Patient createPatient(Patient patient) {
        return patientRepository.save(patient);
    }
    
    public Patient updatePatient(Long id, Patient patient) {
        Patient existing = getPatientById(id);
        existing.setFirstName(patient.getFirstName());
        existing.setLastName(patient.getLastName());
        existing.setDateOfBirth(patient.getDateOfBirth());
        existing.setGender(patient.getGender());
        existing.setEmail(patient.getEmail());
        existing.setPhone(patient.getPhone());
        existing.setAddress(patient.getAddress());
        existing.setBloodType(patient.getBloodType());
        existing.setEmergencyContact(patient.getEmergencyContact());
        existing.setEmergencyPhone(patient.getEmergencyPhone());
        return patientRepository.save(existing);
    }
    
    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
}""")
    
    # Controller
    os.makedirs(f"{base}/controller", exist_ok=True)
    with open(f"{base}/controller/PatientController.java", 'w') as f:
        f.write("""package com.pds.clinicservice.controller;

import com.pds.clinicservice.entity.Patient;
import com.pds.clinicservice.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clinic/patients")
@RequiredArgsConstructor
public class PatientController {
    private final PatientService patientService;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN', 'SECRETARY')")
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN', 'PATIENT', 'SECRETARY')")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN', 'SECRETARY')")
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        return ResponseEntity.ok(patientService.createPatient(patient));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN', 'SECRETARY')")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        return ResponseEntity.ok(patientService.updatePatient(id, patient));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok().build();
    }
}""")
    
    # Configuration
    os.makedirs(f"{base}/config", exist_ok=True)
    with open(f"{base}/config/SecurityConfig.java", 'w') as f:
        f.write("""package com.pds.clinicservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            );
        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }
}""")
    
    # application.yml
    with open(f"{PROJECT_ROOT}/clinic-service/src/main/resources/application.yml", 'w') as f:
        f.write("""server:
  port: 8083

spring:
  application:
    name: clinic-service
  datasource:
    url: jdbc:mysql://mysql:3306/pds_clinic?createDatabaseIfNotExist=true
    username: root
    password: rootpassword
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://keycloak:8080/realms/pds-realm

eureka:
  client:
    serviceUrl:
      defaultZone: http://discovery-service:8761/eureka/""")

# Run creation
create_clinic_service()
print("Clinic service created successfully!")
