# Swagger API Testing Guide - FinFlow

This guide provides step-by-step instructions for testing the FinFlow microservices endpoints using the unified Swagger UI.

## 1. Accessing Swagger UI
Ensure all backend services (Config, Eureka, Gateway, Auth, Application, Admin, Document) are running.

*   **URL:** `http://localhost:8090/swagger-ui.html`
*   **Dropdown:** Use the "Select a definition" dropdown in the top right of the Swagger interface to switch between services dynamically.

---

## 2. Authentication Flow (Required for Secured Endpoints)
Most business endpoints require a JWT Bearer Token.

1.  **Register a User (Auth Service):**
    *   Select **Auth Service** in the dropdown.
    *   Path: `POST /gateway/auth/signup`
    *   Payload:
        ```json
        {
          "name": "John Doe",
          "email": "john@example.com",
          "password": "password123",
          "role": "USER"
        }
        ```
2.  **Login (Auth Service):**
    *   Path: `POST /gateway/auth/login`
    *   Payload:
        ```json
        {
          "email": "john@example.com",
          "password": "password123"
        }
        ```
3.  **Copy Token:** Copy the raw JWT string returned in the response body.
4.  **Authorize:** Click the **Authorize** lock button at the top right of the Swagger page. Paste the **raw JWT token** directly into the Value field (do NOT type `Bearer `, Swagger prefixes it automatically), and click **Authorize**.

---

## 3. Application Service Endpoints
**Switch to "Application Service" in the dropdown.**

### Dynamic Interest Rate Preview (New Endpoint)
*   **Path:** `GET /gateway/applications/calculate-rate`
*   **Query Params:** `amount = 30000`, `purpose = Home Improvement`
*   *Action:* Instantly returns the calculated rate without saving application data.

### Create Draft Application
*   **Path:** `POST /gateway/applications`
*   **Payload:**
    ```json
    {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "address": "123 Street, City",
      "employerName": "Tech Corp",
      "jobTitle": "Developer",
      "annualIncome": 75000.0,
      "loanAmount": 25000.0,
      "loanPurpose": "Home Improvement",
      "loanTermMonths": 36
    }
    ```
*   *Response:* The returned object will include an automatically computed `"interestRate"` field (7.75% for this scenario).

### Submit Application
*   **Path:** `POST /gateway/applications/{id}/submit`
*   *Action:* Changes status from `DRAFT` to `SUBMITTED`, sends email notification, and logs event on RabbitMQ.

---

## 4. Document Service Endpoints
**Switch to "Document Service" in the dropdown.**

### Upload File
*   **Path:** `POST /gateway/documents/upload`
*   **Multipart Form Data:**
    *   `file`: (Choose image or PDF file)
    *   `applicationId`: `1` (The ID of the created loan application)
    *   `fileType`: `SALARY_SLIP` or `ID_PROOF`

---

## 5. Admin Service Endpoints
**Switch to "Admin Service" in the dropdown.**
*Note: Logout the user token and authenticate as an ADMIN user (`role: ADMIN` during signup) to call these.*

### Review Loan & Add Underwriter Decision
*   **Path:** `POST /gateway/admin/applications/{id}/decision`
*   **Payload:**
    ```json
    {
      "decisionType": "APPROVED",
      "remarks": "Credit verified. Approved.",
      "decidedBy": 2
    }
    ```
*   *Action:* Updates status in application-service, logs audit trail, and fires transaction email.

### Fetch Audit logs
*   **Path:** `GET /gateway/admin/reports`
*   *Action:* Lists all system event reports logged from RabbitMQ.

---

## 6. Testing Tips
*   **Check Eureka:** If a service doesn't appear in the dropdown, check the Service Registry at `http://localhost:8761`.
*   **MySQL Port Collision:** If docker fails to bind MySQL, map the service to host port `3307` in your `docker-compose.yml` or stop your local MySQL background service.
