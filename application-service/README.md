# FinFlow - Application Service

The Application Service (Loan Service) handles the core business logic of the FinFlow Loan Management system. It is responsible for processing loan applications, evaluating eligibility, and interacting with databases to manage the application lifecycle.

## Prerequisites
- Java 17
- Maven 3.8+
- MySQL (Running)
- RabbitMQ (Running)
- Config Server, Eureka Server, and Auth Service must be up and running.

## How to Run the Project Locally

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd <project-directory>/application-service
```

### Step 2: Build the Service
```bash
mvn clean install
```

### Step 3: Run the Service
Run the service directly using:
```bash
mvn spring-boot:run
```

---

## How to Run using Docker

Run the entire cluster with Docker Compose:
```bash
docker-compose up --build -d application-service
```
Retrieve logs:
```bash
docker logs -f application-service
```

---

## How to Test on Postman

### Step 1: Obtain a JWT Token
Most loan operations require the user to be authenticated.
1. **URL:** `POST http://localhost:8080/api/auth/login`
2. **Body:** Provide valid credentials in JSON format.
3. Copy the Bearer Token from the response.

### Step 2: Configure Postman
In your Postman request, go to the **Authorization** tab, select **Bearer Token**, and paste the token.

### Step 3: Apply for a New Loan
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/applications/apply` (Assuming API Gateway routing)
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "applicantName": "John Doe",
    "loanAmount": 50000,
    "loanTermMonths": 36,
    "loanType": "PERSONAL"
  }
  ```
- **Send** the request. The service should return the created loan application details and the assigned application ID.

### Step 4: Check Loan Application Status
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/applications/{applicationId}`
- **Send** the request to retrieve the current status of the created application.
