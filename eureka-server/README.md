# FinFlow - Eureka Server

The Eureka Server acts as the Service Registry for the FinFlow Loan Management microservices architecture. It allows all other services to find and communicate with each other dynamically without hardcoding hostnames and IP addresses.

## Prerequisites
- Java 17
- Maven 3.8+

## How to Run the Project Locally

### Step 1: Navigate to the Directory
```bash
cd <project-directory>/eureka-server
```

### Step 2: Build the Service
Compile and package the Eureka Registry.
```bash
mvn clean install
```

### Step 3: Run the Application
Start the service. This is usually the **first service** you should start in the microservice ecosystem (or second if you run Config Server first, depending on the architecture).
```bash
mvn spring-boot:run
```
By default, the Eureka Server runs on port **8761**.

---

## How to Run using Docker

To start the Eureka Server within a Docker cluster using docker-compose:
```bash
docker-compose up --build -d eureka-server
```
Check status:
```bash
docker logs -f eureka-server
```

---

## How to Verify Services (Browser/Postman)

The Eureka Server provides a user-friendly UI to verify which microservices have successfully registered with the network.

### Verify via Web Browser (Recommended)
1. After starting Eureka and a few other microservices, open your web browser.
2. Navigate to: `http://localhost:8761`
3. You will see the **Spring Eureka UI**.
4. Inside the **Instances currently registered with Eureka** section, you should see your running services (e.g., `API-GATEWAY`, `AUTH-SERVICE`, `APPLICATION-SERVICE`) listed along with their status (`UP (1)`).

### Verify via Postman (API Request)
If you wish to view the registry programmatically via API:
1. Open Postman.
2. Select **GET** method.
3. **URL:** `http://localhost:8761/eureka/apps`
4. **Headers:** `Accept: application/json`
5. **Send** the request.
6. The response will be a JSON object containing a raw list of all applications and their instances currently registered.
