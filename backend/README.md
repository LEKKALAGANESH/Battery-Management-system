# Battery Management System (BMS) — Backend

Node.js + Express + PostgreSQL implementation for ingesting and querying EV battery telemetry.

## Features
- RESTful APIs for ingest + query
- JWT authentication
- Rate limit, CORS, validation
- Request logging (morgan + winston-like simple logger)
- PostgreSQL schema with proper indexing (battery_id, time)
- OpenAPI spec (`swagger.yaml`)
- Docker Compose with Postgres + Adminer
- SQL migrations & seed
- Production-ready folder structure

## Quick Start

### 1) Environment
Create `.env` (see `.env.example`):
```
PORT=8080
DATABASE_URL=postgres://postgres:postgres@localhost:5432/bms
JWT_SECRET=supersecretjwt
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 2) Run with Docker
```
docker compose up -d
# Wait for postgres then initialize schema:
psql postgres://postgres:postgres@localhost:5432/bms -f ./sql/init.sql
psql postgres://postgres:postgres@localhost:5432/bms -f ./sql/seed.sql
```

### 3) Install & start server
```
npm install
npm run dev
```

### 4) API Docs
Import `swagger.yaml` into Postman/Insomnia or view using Swagger UI.

## Endpoints (summary)
- `POST /api/auth/login` — get JWT
- `POST /api/battery/data` — ingest a new reading
- `GET /api/battery/:id` — all readings for a battery
- `GET /api/battery/:id/:field` — field series (e.g., voltage)
- `GET /api/battery/:id/:field?start=...&end=...` — field series in range

Auth required (Bearer token) for GET routes by default.

## Security & UX Notes
- Validates payloads, clamps unrealistic values, and rejects out-of-order timestamps
- Paginates large responses
- Structured logs with request IDs for traceability
- CORS limited to configured origin
