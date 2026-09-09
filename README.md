# FinFlow Loan Management System

[![Framework](https://img.shields.io/badge/Angular-v21.2-red.svg)](https://angular.io/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-v3.2.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2023.0.1-blue.svg)](https://spring.io/projects/spring-cloud)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An enterprise-grade, microservice-based digital loan application, document verification, and underwriting platform designed for scalable financial services.

---

## 🔗 Project & Developer Links

- **GitHub Repository**: [https://github.com/rajmohit21/Finflow-Loan-Management-System](https://github.com/rajmohit21/Finflow-Loan-Management-System)
- **Developer Portfolio**: [https://github.com/rajmohit21](https://github.com/rajmohit21)
- **Developer**: Mohit Raj — Full Stack / Software Developer ([LinkedIn](https://www.linkedin.com/in/mohit-raj-/))

---

## 🚀 Key Features

1. **Dual Role Portals**:
   - **Loan Applicant Portal**: Single-page wizard for loan application submission, document management, and real-time approval tracking.
   - **Admin / Underwriter Portal**: Comprehensive review dashboard, document audit & verification, credit evaluation, and formal decisioning.
2. **Interactive Scanned Document Vault**:
   - Canvas-based document preview modal for Aadhaar, PAN Card, Bank Statements, and Income Proofs with official seals, QR code watermarks, SHA-256 hash digests, zoom (+/-), rotation (90°), and download capabilities.
3. **Automated EMI Financial Schedule**:
   - Real-time loan repayment calculation ($\text{EMI} = \frac{P \cdot r \cdot (1 + r)^n}{(1 + r)^n - 1}$) displaying monthly payment, loan tenure, total interest, and sanction schedules.
4. **Role & Dynamic Profile Isolation**:
   - Registered users log in with their actual profile data. Newly registered users start with zero draft applications and clean metric counters.
5. **High-Contrast Dark/Light Theme**:
   - Comprehensive design system supporting instant theme switching across all views, tables, cards, steppers, and authentication screens.

---

## 🏗️ System Architecture

```
                    INTERVIEWER / RECRUITER
                               |
                               v
                   [Vercel SPA Web Platform]
                 Angular 21 Interactive UI
                               |
                               v
                     [Spring Cloud Gateway]
                         (Port: 8090)
                               |
        +----------------------+----------------------+
        |                      |                      |
        v                      v                      v
 [Auth Service]       [Application Service]  [Document Service]
  (Port: 8081)             (Port: 8082)           (Port: 8083)
        |                      |                      |
        +----------------------+----------------------+
                               |
                               v
               [MySQL 8.0 / Central Database]
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Angular 21 (TypeScript 5.9, RxJS 7.8)
- **Styling**: Vanilla CSS3, Bootstrap 5.3, Bootstrap Icons
- **Deployment**: Vercel Single Page Application (SPA)

### Backend Microservices
- **Core Stack**: Java 17, Spring Boot 3.2.4, Spring Security, JWT Token Authentication
- **Service Discovery**: Netflix Eureka Discovery Server (`eureka-server` - Port 8761)
- **Central Configuration**: Spring Cloud Config Server (`config-server` - Port 8888)
- **API Routing**: Spring Cloud Gateway (`api-gateway` - Port 8090)
- **Business Microservices**:
  - `auth-service` (Port 8081): Identity validation & registration
  - `application-service` (Port 8082): Loan lifecycle management
  - `document-service` (Port 8083): Document storage & verification
  - `admin-service` (Port 8084): Underwriting decisioning & reporting
- **Message Broker**: RabbitMQ 3.0
- **Database**: MySQL 8.0

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Loan Applicant** | `rahul.sharma@example.com` | `password123` | Applicant Dashboard & Loan Wizard |
| **Admin Underwriter** | `admin@finflow.com` | `password123` | Underwriter Review & Document Verification |

---

## 💻 Local Setup & Execution

### 1. Prerequisites
- **JDK 17** or higher
- **Node.js 18+** & **npm 9+**
- **Docker & Docker Compose**

### 2. Microservices Backend Execution via Docker Compose
```powershell
# Clone the repository
git clone https://github.com/rajmohit21/Finflow-Loan-Management-System.git
cd Finflow-Loan-Management-System

# Spin up all backend microservices, Eureka, Config Server, MySQL, and RabbitMQ
docker-compose up -d --build
```

### 3. Frontend Web App Execution
```powershell
cd frontend
npm install
npm start
```
Open [http://localhost:4200](http://localhost:4200) in your browser.

---

## 📂 Project Repository Structure

```
Finflow-Loan-Management-System/
├── api-gateway/            # Spring Cloud API Gateway (Port 8090)
├── auth-service/           # User Authentication & JWT Service (Port 8081)
├── application-service/    # Core Loan Application Microservice (Port 8082)
├── document-service/       # File Upload & Verification Service (Port 8083)
├── admin-service/          # Underwriter Review & Decision Service (Port 8084)
├── config-server/          # Central Configuration Management (Port 8888)
├── eureka-server/          # Netflix Eureka Service Discovery (Port 8761)
├── frontend/               # Angular 21 Production SPA Web Application
├── portfolio/              # Developer Portfolio Website (React + TypeScript)
├── docker-compose.yml      # Full Stack Orchestration Blueprint
└── README.md               # Production Documentation
```

---

## 👤 Developer Contact

- **Developer**: Mohit Raj
- **Education**: B.Tech in Computer Science & Engineering, Lovely Professional University (2022–2026)
- **LinkedIn**: [https://www.linkedin.com/in/mohit-raj-/](https://www.linkedin.com/in/mohit-raj-/)
- **GitHub**: [https://github.com/rajmohit21](https://github.com/rajmohit21)
- **Email**: `mohitraj2180@gmail.com`
