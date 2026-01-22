#!/usr/bin/env python3
"""
PDS Complete Project Generator
Generates all microservices with Spring Boot and React frontend
"""

import os
import json

PROJECT_ROOT = "/home/claude/pds-complete-project"

# Service configurations
SERVICES = {
    "discovery-service": {
        "port": 8761,
        "description": "Service Discovery with Eureka",
        "dependencies": ["eureka-server"]
    },
    "gateway-service": {
        "port": 8081,
        "description": "API Gateway",
        "dependencies": ["gateway", "eureka-client", "oauth2-resource-server"]
    },
    "auth-service": {
        "port": 8082,
        "description": "Authentication Service",
        "dependencies": ["web", "data-jpa", "security", "oauth2-resource-server", "eureka-client"]
    },
    "clinic-service": {
        "port": 8083,
        "description": "Clinic Management Service",
        "dependencies": ["web", "data-jpa", "security", "oauth2-resource-server", "eureka-client", "redis"]
    },
    "medical-service": {
        "port": 8084,
        "description": "Medical Records Service",
        "dependencies": ["web", "data-jpa", "security", "oauth2-resource-server", "eureka-client", "kafka"]
    },
    "consultation-service": {
        "port": 8085,
        "description": "Consultation Service",
        "dependencies": ["web", "data-jpa", "security", "oauth2-resource-server", "eureka-client", "kafka"]
    }
}

def create_directory_structure():
    """Create directory structure for all services"""
    print("Creating directory structure...")
    for service in SERVICES.keys():
        service_path = os.path.join(PROJECT_ROOT, service)
        os.makedirs(f"{service_path}/src/main/java/com/pds/{service.replace('-', '')}", exist_ok=True)
        os.makedirs(f"{service_path}/src/main/resources", exist_ok=True)
        os.makedirs(f"{service_path}/src/test/java", exist_ok=True)

def generate_pom_xml(service_name, config):
    """Generate pom.xml for a service"""
    base_dependencies = """
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>"""
    
    # Add specific dependencies
    deps_map = {
        "web": '<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>',
        "data-jpa": '<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-jpa</artifactId></dependency>',
        "security": '<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-security</artifactId></dependency>',
        "oauth2-resource-server": '<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-oauth2-resource-server</artifactId></dependency>',
        "eureka-server": '<dependency><groupId>org.springframework.cloud</groupId><artifactId>spring-cloud-starter-netflix-eureka-server</artifactId></dependency>',
        "eureka-client": '<dependency><groupId>org.springframework.cloud</groupId><artifactId>spring-cloud-starter-netflix-eureka-client</artifactId></dependency>',
        "gateway": '<dependency><groupId>org.springframework.cloud</groupId><artifactId>spring-cloud-starter-gateway</artifactId></dependency>',
        "redis": '<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-redis</artifactId></dependency>',
        "kafka": '<dependency><groupId>org.springframework.kafka</groupId><artifactId>spring-kafka</artifactId></dependency>'
    }
    
    specific_deps = "\n        ".join([deps_map.get(dep, "") for dep in config["dependencies"] if dep in deps_map])
    
    pom_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>

    <groupId>com.pds</groupId>
    <artifactId>{service_name}</artifactId>
    <version>1.0.0</version>
    <name>{config["description"]}</name>

    <properties>
        <java.version>17</java.version>
        <spring-cloud.version>2023.0.0</spring-cloud.version>
    </properties>

    <dependencies>
        {specific_deps}
        {base_dependencies}
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.33</version>
        </dependency>
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${{spring-cloud.version}}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>"""
    
    with open(f"{PROJECT_ROOT}/{service_name}/pom.xml", "w") as f:
        f.write(pom_content)

def generate_dockerfiles():
    """Generate Dockerfiles for all services"""
    for service_name, config in SERVICES.items():
        dockerfile_content = f"""FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE {config["port"]}
ENTRYPOINT ["java", "-jar", "app.jar"]"""
        
        with open(f"{PROJECT_ROOT}/{service_name}/Dockerfile", "w") as f:
            f.write(dockerfile_content)

def main():
    print("=" * 50)
    print("PDS Project Generator Starting...")
    print("=" * 50)
    
    create_directory_structure()
    
    print("Generating pom.xml files...")
    for service_name, config in SERVICES.items():
        generate_pom_xml(service_name, config)
        print(f"  ✓ {service_name}")
    
    print("Generating Dockerfiles...")
    generate_dockerfiles()
    
    print("=" * 50)
    print("Generation Complete!")
    print("=" * 50)

if __name__ == "__main__":
    main()
