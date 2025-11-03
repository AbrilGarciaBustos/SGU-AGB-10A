FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests && cp target/*.jar app.jar

Expose 8080

ENTRYPOINT ["java","-jar","app.jar"]