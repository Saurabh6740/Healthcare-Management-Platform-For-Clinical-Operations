# Multi-stage build for MediSphere Microservices
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

# Copy Maven wrapper and project source
COPY mvnw pom.xml ./
COPY .mvn .mvn
COPY api-gateway ./api-gateway
COPY auth-service ./auth-service
COPY healthcare-service ./healthcare-service
COPY fhir-service ./fhir-service
COPY discovery-server ./discovery-server
COPY prediction-service ./prediction-service
COPY explainability-service ./explainability-service
COPY model-service ./model-service

# Build all modules skipping tests
RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

# Lightweight Runtime Stage
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/healthcare-service/target/*.jar app.jar

ENV PORT=8082
EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]
