# UML & ERD (Mermaid)

```mermaid
erDiagram
  USERS ||--o{ BATTERY_READINGS : "owns"
  USERS {
    int id PK
    string email
    string password_hash
    timestamp created_at
  }
  BATTERY_READINGS {
    bigint id PK
    string battery_id
    float current
    float voltage
    float temperature
    timestamp time
  }
```

```mermaid
graph TD
  EV[EV Device] -->|POST /api/battery/data| API[Express API]
  UI[React Dashboard] -->|GET /api/battery/:id/:field (JWT)| API
  API --> PG[(PostgreSQL)]
  Admin[Adminer] --> PG
```
