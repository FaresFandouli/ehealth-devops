#!/bin/bash

echo "=========================================="
echo "PDS Complete Project Generator"
echo "=========================================="

PROJECT_ROOT="/home/claude/pds-complete-project"

# Function to create pom.xml for a service
create_pom() {
    local service_name=$1
    local port=$2
    local description=$3
    
    cat > "$PROJECT_ROOT/$service_name/pom.xml" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
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
    <artifactId>SERVICE_NAME</artifactId>
    <version>1.0.0</version>
    <name>SERVICE_DESCRIPTION</name>

    <properties>
        <java.version>17</java.version>
        <spring-cloud.version>2023.0.0</spring-cloud.version>
        <keycloak.version>23.0.0</keycloak.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-config</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.33</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
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
</project>
EOF

    # Replace placeholders
    sed -i "s/SERVICE_NAME/$service_name/g" "$PROJECT_ROOT/$service_name/pom.xml"
    sed -i "s/SERVICE_DESCRIPTION/$description/g" "$PROJECT_ROOT/$service_name/pom.xml"
}

# Function to create Dockerfile
create_dockerfile() {
    local service_name=$1
    local port=$2
    
    cat > "$PROJECT_ROOT/$service_name/Dockerfile" << EOF
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE $port
ENTRYPOINT ["java", "-jar", "app.jar"]
EOF
}

echo "Creating Discovery Service..."
create_pom "discovery-service" 8761 "Discovery Service"
create_dockerfile "discovery-service" 8761

echo "Creating Gateway Service..."
create_pom "gateway-service" 8081 "API Gateway Service"
create_dockerfile "gateway-service" 8081

echo "Creating Auth Service..."
create_pom "auth-service" 8082 "Authentication Service"
create_dockerfile "auth-service" 8082

echo "Creating Clinic Service..."
create_pom "clinic-service" 8083 "Clinic Management Service"
create_dockerfile "clinic-service" 8083

echo "Creating Medical Service..."
create_pom "medical-service" 8084 "Medical Records Service"
create_dockerfile "medical-service" 8084

echo "Creating Consultation Service..."
create_pom "consultation-service" 8085 "Consultation Service"
create_dockerfile "consultation-service" 8085

echo "=========================================="
echo "All services structure created successfully!"
echo "=========================================="
