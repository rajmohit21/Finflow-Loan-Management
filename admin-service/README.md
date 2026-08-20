# FinFlow - Admin Service

The Admin Service is responsible for overseeing and managing the back-office operations in the FinFlow Loan Management system. It provides APIs to configure system parameters, view reports, and manage loans from an administrator's perspective.

## Prerequisites
- Java 17
- Maven 3.8+
- MySQL (running locally or via Docker)
- RabbitMQ (for messaging)
- Config Server, Eureka Server, and Auth Service must be running.

## How to Run the Project Locally

### Step 1: Clone the Repository
Ensure you have the FinFlow project cloned in your local machine.
```bash
git clone <repository-url>
cd <project-directory>/admin-service
```

### Step 2: Build the Service
Compile and package the application using Maven.
```bash
mvn clean install
```

### Step 3: Run the Service
You can run the application directly using the Spring Boot Maven plugin:
```bash
mvn spring-boot:run
```
*(Alternatively, you can run the generated `.jar` file in the `target/` directory: `java -jar target/admin-service-0.0.1-SNAPSHOT.jar`)*

---

## How to Run using Docker

If you prefer to run the entire stack using Docker, go to the root of the parent project and run:
```bash
docker-compose up --build -d
```
You can view the logs for this specific service by running:
```bash
docker logs -f admin-service
```

---

## How to Test on Postman

### Step 1: Obtain a JWT Token
Admin endpoints are secured. You must first log in via the Auth Service to obtain a JWT token.
1. **URL:** `POST http://localhost:8080/api/auth/login` (Assuming API Gateway runs on 8080)
2. **Body (JSON):**
   ```json
   {
     "username": "adminUser",
     "password": "adminPassword"
   }
   ```
3. Copy the `token` from the JSON response.

### Step 2: Configure Postman Request
1. Open Postman and create a new request.
2. Go to the **Authorization** tab.
3. Select **Bearer Token** from the dropdown menu.
4. Paste the token you copied from Step 1.

### Step 3: Call Admin Service APIs
You can now test the admin-specific endpoints. For example, to fetch system metrics or user summaries:

**Example Request 1: Get All Loan Statistics**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/admin/loans/statistics` (using API Gateway)
- **Headers:** Automatically includes Bearer Token if configured in Step 2.

**Example Request 2: Update Application Status**
- **Method:** `PUT`
- **URL:** `http://localhost:8080/api/admin/applications/{id}/status`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "status": "APPROVED",
    "remarks": "All documents verified and credit score is satisfactory."
  }
  ```
- **Send** the request and verify the successfully updated response.
