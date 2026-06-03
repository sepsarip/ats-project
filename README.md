# 📄 Applicant Tracking System (ATS) Project

**Applicant Tracking System (ATS)** application for automating the application process, CV/Resume text extraction, and matching candidate compatibility with job posting qualifications using NLP (Natural Language Processing) models.

---

## 🚀 Overview

This ATS system is a complete monorepo platform that integrates an interactive frontend, a secure backend API, a PostgreSQL relational database, and a Python-based AI processing microservice. This system simplifies the recruitment process through:

- **Job Posting Management (Job Board):** HR can publish, update, and delete job postings along with their qualifications.
- **Job Application:** Candidates can apply to job openings by uploading a resume (PDF). The system automatically extracts its text, allowing candidates to apply for jobs matching their qualifications.
- **AI-Powered CV Scoring:** Uses Sentence-Transformer & SpaCy models to measure the semantic similarity between the candidate's profile/CV and the job qualifications, generating an instant match score (0-100%).

---

## 🛠️ Tech Stack & Architecture

The system is designed using a monorepo architecture divided into 3 main services:

1.  **Client (Frontend)**
    - **Technology:** React (Vite), JavaScript, Tailwind CSS, React Router DOM.
    - **Function:** Provides an interactive dashboard interface for Jobseekers, HR, and Administrators.
2.  **Server (Backend API)**
    - **Technology:** Node.js, Express.js, PostgreSQL (`pg`), `node-pg-migrate`, JWT Authentication.
    - **Function:** Provides RESTful APIs, manages role-based access control (RBAC), handles CV file uploads (Multer), and coordinates calls to the AI Microservice.
3.  **AI Service (AI Microservice)**
    - **Technology:** Python (Flask), `pdfplumber` (for PDF extraction), `sentence-transformers` (`all-MiniLM-L6-v2` model for similarity), `spaCy` (for custom NER on IT SKILL entities).
    - **Function:** Securely extracts text from CV files and evaluates the match between the candidate's CV and the job vacancy using Cosine Similarity.
4.  **Infrastructure**
    - **Technology:** Docker & Docker Compose.
    - **Function:** Automatically orchestrates containerization for the database, backend, frontend, and AI service within a secure local network.

---

## 📁 Monorepo Directory Layout

```
.
├── client/                 # React Frontend Application (Port 3000)
│   ├── src/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── shared/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── Dockerfile
│   └── .env.example
├── server/                 # Express Backend API (Port 5000)
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── index.js
│   ├── migrations/
│   ├── Dockerfile
│   └── .env.example
├── ai-service/             # Flask AI Service (Port 5001 - Internal)
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── config.py
│   │   └── logging_config.py
│   ├── main.py
│   ├── Dockerfile
│   └── .env.example
├── erd.mermaid             # Entity-Relationship Diagram (Mermaid Format)
├── docker-compose.yml      # Docker container orchestration configuration
└── .env.example            # Global environment variable template
```

---

## ⚙️ Core API Endpoints

### 1. Backend Service (`server`) - Port `5000`

| Method     | Endpoint                                          | Access Level (Role)       | Description                                             |
| :--------- | :------------------------------------------------ | :------------------------ | :------------------------------------------------------ |
| **POST**   | `/api/auth/register`                              | Public                    | Register a new user account for jobseekers              |
| **POST**   | `/api/auth/login`                                 | Public                    | Authenticate user & return JWT Token                    |
| **POST**   | `/api/auth/change-password`                       | Authenticated (All Roles) | Change password of the active account                   |
| **POST**   | `/api/admin/users/hr`                             | Admin Only                | Create a new account specifically for HR staff          |
| **GET**    | `/api/jobs`                                       | Public / Authenticated    | View list of active job postings                        |
| **POST**   | `/api/jobs`                                       | Admin / HR                | Create a new job posting                                |
| **GET**    | `/api/jobs/:id`                                   | Public / Authenticated    | View details of a specific job posting                  |
| **PUT**    | `/api/jobs/:id`                                   | Admin / HR                | Update information of a job posting                     |
| **DELETE** | `/api/jobs/:id`                                   | Admin / HR                | Delete a job posting                                    |
| **POST**   | `/api/jobs/:jobId/apply`                          | Jobseeker Only            | Submit application by attaching CV file                 |
| **GET**    | `/api/jobs/:jobId/candidates`                     | Admin / HR                | View list of candidates for a specific job              |
| **GET**    | `/api/jobs/:jobId/candidates/:userId`             | Admin / HR                | View candidate profile details & AI compatibility score |
| **GET**    | `/api/jobs/:jobId/candidates/:userId/cv/download` | Admin / HR                | Download original candidate CV file                     |
| **GET**    | `/api/health`                                     | Public                    | Check backend health status                             |
| **GET**    | `/api/health/ai`                                  | Public                    | Check connection from Backend to AI Service             |

### 2. AI Service (`ai-service`) - Port `5001` (Internal Only)

| Method   | Endpoint        | Description                                     | Input Format / Payload                                  |
| :------- | :-------------- | :---------------------------------------------- | :------------------------------------------------------ |
| **POST** | `/extract-text` | Extract raw text from PDF file                  | Multipart Form-Data (`file`: PDF)                       |
| **POST** | `/score-cv-job` | Calculate match score between CV vs Job posting | JSON: `application_id`, `extracted_text_cv`, `job_info` |
| **GET**  | `/health`       | Check AI service operational status             | None                                                    |

---

## How to Run the Application

### Using Docker Compose

The fastest way to spin up the entire system along with its configuration:

1. **Ensure environment variables (`.env`) are correctly configured.**
2. **Ensure Docker & Docker Compose are running on your system.**
3. **Build & run all containers in the background:**
   ```bash
   docker compose up --build -d
   ```
4. **Check container status:**
   ```bash
   docker compose ps
   ```
