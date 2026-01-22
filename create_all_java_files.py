#!/usr/bin/env python3
import os

PROJECT_ROOT = "/home/claude/pds-complete-project"

# Java files for each service
java_files = {
    "gateway-service": {
        "GatewayServiceApplication.java": """package com.pds.gatewayservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class GatewayServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayServiceApplication.class, args);
    }
}""",
        "application.yml": """server:
  port: 8081

spring:
  application:
    name: gateway-service
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: lb://auth-service
          predicates:
            - Path=/api/auth/**
        - id: clinic-service
          uri: lb://clinic-service
          predicates:
            - Path=/api/clinic/**
        - id: medical-service
          uri: lb://medical-service
          predicates:
            - Path=/api/medical/**
        - id: consultation-service
          uri: lb://consultation-service
          predicates:
            - Path=/api/consultation/**
      default-filters:
        - DedupeResponseHeader=Access-Control-Allow-Credentials Access-Control-Allow-Origin
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: "http://localhost:3000"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - OPTIONS
            allowedHeaders: "*"
            allowCredentials: true

eureka:
  client:
    serviceUrl:
      defaultZone: http://discovery-service:8761/eureka/"""
    },
    "auth-service": {
        "AuthServiceApplication.java": """package com.pds.authservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class AuthServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }
}""",
        "SecurityConfig.java": """package com.pds.authservice.config;

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
                .requestMatchers("/api/auth/public/**", "/actuator/**").permitAll()
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
}""",
        "application.yml": """server:
  port: 8082

spring:
  application:
    name: auth-service
  datasource:
    url: jdbc:mysql://mysql:3306/pds_auth?createDatabaseIfNotExist=true
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
      defaultZone: http://discovery-service:8761/eureka/"""
    }
}

# Create files
for service, files in java_files.items():
    service_path = os.path.join(PROJECT_ROOT, service)
    for filename, content in files.items():
        if filename.endswith('.java'):
            java_dir = f"{service_path}/src/main/java/com/pds/{service.replace('-', '')}"
            if 'Config' in filename:
                java_dir = f"{java_dir}/config"
            os.makedirs(java_dir, exist_ok=True)
            filepath = os.path.join(java_dir, filename)
        else:
            resources_dir = f"{service_path}/src/main/resources"
            os.makedirs(resources_dir, exist_ok=True)
            filepath = os.path.join(resources_dir, filename)
        
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Created: {filepath}")

print("All Java files created successfully!")
