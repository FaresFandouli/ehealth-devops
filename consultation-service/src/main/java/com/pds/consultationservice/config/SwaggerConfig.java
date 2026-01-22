package com.pds.consultationservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI consultationServiceAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("🩺 Consultation Service API - MedInsight")
                        .description("API de gestion des consultations médicales")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("MedInsight Team")
                                .email("support@medinsight.com")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8081/api/consultation")
                                .description("Via Gateway (Recommandé)"),
                        new Server()
                                .url("http://localhost:8085/api/consultation")
                                .description("Direct - Consultation Service")
                ))
                .components(new Components()
                        .addSecuritySchemes("bearer-jwt", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Entrez votre token JWT (sans 'Bearer')")))
                .addSecurityItem(new SecurityRequirement().addList("bearer-jwt"));
    }
}
