# ats-project

ATS (Applicant Tracking System)

## Tech Stack

- Frontend: React (Vite), JavaScript, Tailwind CSS
- Backend: Express.js, JavaScript, PostgreSQL (`pg`), JWT-ready env contract
- AI Service: Python Flask
- Infrastructure: Docker Compose

## Monorepo Structure

```
.
|-- client/
|   |-- src/
|   |-- Dockerfile
|   `-- .env.example
|-- server/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   `-- services/
|   |-- Dockerfile
|   `-- .env.example
|-- ai-service/
|   |-- app/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- utils/
|   |-- Dockerfile
|   `-- .env.example
|-- docker-compose.yml
`-- .env.example
```

## Run (Phase 1)

1. Start all services:

   ```bash
   docker compose up --build -d
   ```

2. Check container status:

   ```bash
   docker compose ps
   ```

3. Check backend health:

   ```bash
   curl http://localhost:5000/api/health
   ```

4. Check backend -> AI internal call:

   ```bash
   curl http://localhost:5000/api/health/ai
   ```

## Networking Notes

- `client` and `server` are on `ats-public` network.
- `server`, `postgres`, and `ai-service` are on `ats-internal` network.
- `ai-service` has no host port mapping, so it is not publicly exposed.

## Environment Files

- Runtime files used by Docker Compose:
  - Root: `.env`
  - Frontend: `client/.env`
  - Backend: `server/.env`
  - AI Service: `ai-service/.env`
- Template files for onboarding:
  - Root: `.env.example`
  - Frontend: `client/.env.example`
  - Backend: `server/.env.example`
  - AI Service: `ai-service/.env.example`

Use `.env.example` only as templates. Keep real secrets in `.env` and never commit them.
