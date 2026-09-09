# FinFlow - Config Server

The Config Server provides centralized external configuration management across all microservices in the FinFlow Loan Management system. All other microservices fetch their properties (`application.yml` equivalents) from this service.

## Prerequisites
- Java 17
- Maven 3.8+
- No database required.

## How to Run the Project Locally

### Step 1: Navigate to the Directory
```bash
cd <project-directory>/config-server
```

### Step 2: Build the Service
Compile the application.
```bash
mvn clean install
```

### Step 3: Run the Service
Start the config server. Since other microservices depend on it to initialize, this should ideally be the **second service started** (immediately after Eureka Server, or first if Eureka fetches config).
```bash
mvn spring-boot:run
```
By default, the Config Server runs on port **8888**.

---

## How to Run using Docker

Use docker-compose to spin up the Config Server in an isolated container.
```bash
docker-compose up --build -d config-server
```
Check logs:
```bash
docker logs -f config-server
```

---

## How to Test on Postman

You can verify that the Config Server is properly serving configurations by querying it directly. It serves configurations via HTTP endpoints following the pattern `/{application-name}/{profile}`.

### Example: Fetch API Gateway Configurations
1. Open Postman.
2. Select **GET** method.
3. Enter the URL: `http://localhost:8888/api-gateway/default`
4. **Send** the request.
5. The response should be a JSON object containing the `api-gateway` configuration properties fetched from the local config repository (classpath or git).

### Example: Fetch Auth Service Configurations
1. Create a **GET** request.
2. Enter the URL: `http://localhost:8888/auth-service/default`
3. **Send** the request.
4. Verify the JSON response contains configuration details specific to the `auth-service`.
