# FinFlow - Auth Service

The Auth Service manages user authentication and authorization for the FinFlow Loan Management system. It issues JWT tokens upon successful login, handles user registration, and validates credentials.

## Prerequisites
- Java 17
- Maven 3.8+
- MySQL Database (to store user credentials)
- Config Server and Eureka Server running.

## How to Run the Project Locally

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd <project-directory>/auth-service
```

### Step 2: Build the Service
```bash
mvn clean install
```

### Step 3: Run the Service
```bash
mvn spring-boot:run
```

---

## How to Run using Docker

Deploy auth-service along with the required dependencies via docker-compose:
```bash
docker-compose up --build -d auth-service
```
Check the status/logs:
```bash
docker logs -f auth-service
```

---

## How to Test on Postman

The Auth Service is primarily exposed via the API Gateway. Ensure the Gateway is running on `localhost:8080`.

### Step 1: Register a New User
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "username": "johndoe",
    "email": "johndoe@example.com",
    "password": "Password@123",
    "role": "USER"
  }
  ```
- **Send** the request. Expected response is `201 Created` or a success message.

### Step 2: Login / Generate JWT Token
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "username": "johndoe",
    "password": "Password@123"
  }
  ```
- **Send** the request. Expected response should contain the Bearer `token`.

### Step 3: Validate Token (Optional)
If a token validation endpoint exists, you can test it directly:
- **Method:** `GET` or `POST`
- **URL:** `http://localhost:8080/api/auth/validate?token=YOUR_JWT_TOKEN`
- It should return a `true` Boolean or a success message confirming the token is valid.
