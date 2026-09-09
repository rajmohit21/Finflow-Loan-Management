# FinFlow - API Gateway

The API Gateway is the central entry point for all client requests in the FinFlow Loan Management system. It routes requests to the appropriate microservices, handles authentication filtering, and provides load balancing.

## Prerequisites
- Java 17
- Maven 3.8+
- Config Server and Eureka Server must be running before starting the Gateway.

## How to Run the Project Locally

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd <project-directory>/api-gateway
```

### Step 2: Build the Service
Compile and package the application using Maven.
```bash
mvn clean install
```

### Step 3: Run the Service
Run the API Gateway:
```bash
mvn spring-boot:run
```
By default, the API Gateway usually runs on port `8080` (or `8082`, depending on configuration). Check `application.yml` resolving from the Config Server for the exact port.

---

## How to Run using Docker

To run the entire FinFlow stack including the Gateway using Docker, use docker-compose at the root level:
```bash
docker-compose up --build -d api-gateway
```
To view gateway logs:
```bash
docker logs -f api-gateway
```

---

## How to Test on Postman

The API Gateway is not tested directly for business logic but rather for its ability to route requests and enforce security.

### Step 1: Test Routing to Public Endpoints
1. Open Postman.
2. Make a `POST` request to register a new user:
   - **URL:** `http://localhost:8080/api/auth/register` (Gateway port routing to Auth Service)
   - **Body (JSON):**
     ```json
     {
       "username": "testuser",
       "password": "password123",
       "email": "test@example.com"
     }
     ```
   - **Send** and expect a successful 200/201 response.

### Step 2: Test Authentication Filter (Negative Test)
1. In Postman, try to access a protected route without a token:
   - **URL:** `http://localhost:8080/api/loans` (Gateway port routing to Application Service)
   - **Method:** `GET`
2. **Send** the request.
3. You should receive a `401 Unauthorized` response indicating the Gateway filter successfully blocked the request.

### Step 3: Test Authentication Filter (Positive Test)
1. Obtain a valid JWT token via `http://localhost:8080/api/auth/login`.
2. Configure Postman Authorization tab to use **Bearer Token** and paste the JWT.
3. Call `http://localhost:8080/api/loans` again.
4. You should receive a `200 OK` response with the list of loans from the downstream service.
