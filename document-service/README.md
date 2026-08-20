# FinFlow - Document Service

The Document Service handles uploading, downloading, verification, and management of loan documents (e.g., identity proofs, income statements) for the FinFlow Loan Management system.

## Prerequisites
- Java 17
- Maven 3.8+
- Config Server, Eureka Server, and Auth Service must be up and running.

## How to Run the Project Locally

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd <project-directory>/document-service
```

### Step 2: Build the Service
Compile the application using Maven.
```bash
mvn clean install
```

### Step 3: Run the Service
Run the service directly using the Maven plugin:
```bash
mvn spring-boot:run
```

---

## How to Run using Docker

To run Document Service within the containerized environment using docker-compose:
```bash
docker-compose up --build -d document-service
```
Check the execution logs:
```bash
docker logs -f document-service
```

---

## How to Test on Postman

### Step 1: Obtain a JWT Token
Most endpoints require authentication.
1. **URL:** `POST http://localhost:8080/api/auth/login` (Assuming API Gateway runs on 8080)
2. **Body (JSON):** Provide your registered credentials.
3. Save the returned `token`.

### Step 2: Upload a Document
1. Create a new request in Postman.
2. Set the **Method** to `POST`.
3. Set the **URL** to `http://localhost:8080/api/documents/upload`
4. Set **Authorization** to **Bearer Token** and insert your JWT.
5. In the **Body** tab, select **form-data**.
   - **Key 1:** `file` (Change type from Text to **File** using the small dropdown next to the key name). Click **Select Files** and choose an image or PDF from your computer.
   - **Key 2:** `documentType` (Value: `"IDENTITY_PROOF"`)
   - **Key 3:** `applicationId` (Value: `"1"`, assuming Application 1 exists)
6. **Send** the request. The service will return a confirmation with a `documentId` or the saved path.

### Step 3: Download/Retrieve a Document
1. Create a `GET` request.
2. **URL:** `http://localhost:8080/api/documents/{documentId}/download`
3. Include your Bearer Token in the **Authorization** tab.
4. **Send** the request. Postman should open or download the file appropriately.
