# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the Maven wrapper and project object model (pom.xml)
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (this caches them so we don't redownload on every code change)
RUN ./mvnw dependency:go-offline -B || true

# Copy the project source
COPY src src

# Package the application (skip tests for faster deployment)
RUN ./mvnw package -DskipTests

# Run the jar file
CMD ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]
