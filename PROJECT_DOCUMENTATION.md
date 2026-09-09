# FinFlow Loan Management System - Project Documentation

## 1. Project Overview
**FinFlow** is a modern, microservices-based backend loan management platform designed to streamline the loan application, documentation, and approval process. It features a robust Spring Boot backend architecture, ensuring scalability, security, and high performance, with interactive testing fully supported via Swagger OpenAPI docs aggregation at the Gateway.

---

## 2. High-Level Architecture (HLD)

The system follows a distributed microservices architecture where each service has a specific responsibility and its own database.

```mermaid
graph TD
    User((Client/Developer)) -->|REST & Swagger UI| AGW[API Gateway :8090]
    
    subgraph "Infrastructure Services"
        CS[Config Server :8888]
        ES[Eureka Server :8761]
        RMQ[RabbitMQ Broker]
    end

    subgraph "Business Services"
        AGW --> AS[Auth Service :8081]
        AGW --> APP[Application Service :8082]
        AGW --> DOC[Document Service :8083]
        AGW --> ADM[Admin Service :8084]
    end

    AS --> DB1[(Auth DB)]
    APP --> DB2[(Application DB)]
    DOC --> DB3[(Document DB)]
    ADM --> DB4[(Admin DB)]

    APP -.->|Async Message| RMQ
    DOC -.->|Async Message| RMQ
    RMQ -.->|Notifications & Logs| ADM
```

---

## 3. Low-Level Design (LLD)

### 3.1. Service Breakdown

| Service | Technology | Port | Responsibility |
| :--- | :--- | :--- | :--- |
| **Config Server** | Spring Cloud Config | 8888 | Centralized external configuration management. |
| **Eureka Server** | Spring Cloud Netflix | 8761 | Service registration and discovery. |
| **API Gateway** | Spring Cloud Gateway | 8090 | Entry point, JWT validation, and Swagger OpenAPI aggregation. |
| **Auth Service** | Spring Security, JWT | 8081 | User registration, authentication, and role management. |
| **Application Service** | Spring Boot, JPA | 8082 | Manages loan applications and dynamic interest rate calculations. |
| **Document Service** | Spring Boot, JPA | 8083 | Handles file uploads and document metadata. |
| **Admin Service** | Spring Boot, JPA | 8084 | Underwriting decisions, approvals, and system reporting. |

### 3.2. Data Flow (Sequence Diagram)
The following diagram illustrates a typical loan submission and underwriting review flow:

```mermaid
sequenceDiagram
    participant U as User / Underwriter
    participant G as API Gateway
    participant A as Auth Service
    participant L as Application Service
    participant D as Document Service
    participant ADM as Admin Service

    U->>G: POST /gateway/auth/login
    G->>A: Forward Login Request
    A-->>G: Return JWT Token
    G-->>U: Return JWT Token

    U->>G: POST /gateway/applications (with JWT)
    G->>G: Validate JWT
    G->>L: Strip Prefix & Forward Request (calculates rate)
    L-->>U: Return Saved Draft Application

    U->>G: POST /gateway/documents/upload (with JWT)
    G->>D: Forward File Multipart upload
    D-->>U: Return Uploaded Document Metadata

    U->>G: POST /gateway/admin/applications/{id}/decision (with Admin JWT)
    G->>G: Validate Admin Role
    G->>ADM: Forward Underwriting decision
    ADM->>L: Update application status to APPROVED/REJECTED
    ADM-->>U: Return Saved Decision Object
```

### 3.3. Security Implementation
*   **Authentication:** JWT-based stateless authentication.
*   **Gateway Filter:** `AuthenticationFilter` intercepts requests, validates the token using `JwtUtil`, and injects the `X-User-Id` and `X-User-Email` headers.
*   **RBAC:** Role-Based Access Control implemented in the Gateway for `/gateway/admin/**` paths, restricting access exclusively to users with the `ADMIN` role claim.
*   **Swagger Bypass:** Swagger and OpenAPI docs routes (`/v3/api-docs` and `/swagger-ui`) bypass security verification at the gateway level to allow public interactive sandbox testing.

---

## 4. Core Features

1.  **Risk-based Interest Calculator:** Automatically calculates loan interest rates based on the loan purpose (Education: 6.5%, Home: 8.0%, Personal: 10.5%, Business: 12.0%) and adjusts for loan amount risk adjustments (premiums on low amounts, discounts on high amounts).
2.  **Digital Document Uploads:** Saves attachments (ID cards, pay slips) on the filesystem, linked via logical database records.
3.  **Auditable Logging:** RabbitMQ topic queue logs application and document events asynchronously to feed the Admin Service audit trails.

---

## 5. Technology Stack
*   **Backend:** Java 17, Spring Boot 3.2.4, Spring Cloud (Gateway, Config, Eureka).
*   **Database:** MySQL 8.0.
*   **Messaging:** RabbitMQ.
*   **Observability:** Spring Boot Actuator.
*   **Documentation:** SpringDoc OpenAPI (Swagger).

---

## 6. Port Configuration Summary
*   **Config Server:** 8888
*   **Eureka Server:** 8761
*   **API Gateway:** 8090 (Public Entry / Swagger portal)
*   **Auth Service:** 8081
*   **Application Service:** 8082
*   **Document Service:** 8083
*   **Admin Service:** 8084
*   **RabbitMQ UI:** 15672
