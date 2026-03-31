# Warehouse Ops: Exception & Resolution Workbench

A full-stack warehouse operations platform for reporting, reviewing, resolving, and auditing inventory discrepancies and operational exceptions.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│  Browser                                                            │
│  React + Vite SPA  (port 5173)                                      │
│  – Supabase JS SDK  (auth only)                                     │
│  – Axios client     (REST calls to Spring Boot)                     │
└─────────────────────┬──────────────────────┬────────────────────────┘
                      │  Bearer JWT           │  Supabase Auth SDK
                      ▼                       ▼
          ┌────────────────────┐    ┌──────────────────────┐
          │  Spring Boot API   │    │  Supabase Auth       │
          │  (port 8080)       │◄──►│  (JWT issuer)        │
          │  – /api/**         │    └──────────────────────┘
          │  – JWT validation  │
          │  – Business rules  │
          └─────────┬──────────┘
                    │  JDBC (service role key)
                    ▼
          ┌─────────────────────┐
          │  Supabase Postgres  │
          │  – 10 tables        │
          │  – seed data        │
          └─────────────────────┘
```

**Tech stack:**
- Frontend: React 18 + Vite 5 + JavaScript + Recharts + react-hook-form
- Backend: Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA
- Database: Supabase (Postgres 15) + Supabase Auth
- Styling: Custom CSS variables — warm cream/beige theme matching design deck

---

## Project Structure

```
insy-4325-team-5/
├── README.md
├── supabase/
│   └── migrations/
│       ├── 001_schema.sql        # Full database schema
│       └── 002_seed.sql          # Demo data (12 tickets, users, items)
├── warehouse-frontend/           # React + Vite app
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── App.jsx               # Router + auth wrapper
│       ├── context/AuthContext.jsx
│       ├── api/                  # Axios service files
│       ├── components/
│       │   ├── layout/           # Sidebar, AppLayout, ProtectedRoute
│       │   ├── common/           # StatusBadge, PriorityBadge, DataTable, Modal...
│       │   └── charts/           # SummaryCard, StatusPieChart, PatternBarChart
│       └── pages/                # 9 pages (Login → MasterData)
└── warehouse-backend/            # Spring Boot app
    ├── .env.example
    ├── pom.xml
    └── src/main/java/com/warehouse/ops/
        ├── entity/               # 10 JPA entities
        ├── dto/                  # Request + response DTOs
        ├── repository/           # Spring Data JPA repos
        ├── service/              # Business logic + audit logging
        ├── controller/           # REST endpoints
        ├── mapper/               # Entity → DTO conversion
        ├── config/               # Security, CORS, JWT filter
        └── exception/            # Global exception handler
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- Java 17 (e.g., OpenJDK 17)
- Maven 3.9+
- A Supabase project (free tier works fine)

---

### Step 1 — Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. In the SQL Editor, run the migrations in order:
   ```sql
   -- Run: supabase/migrations/001_schema.sql
   -- Run: supabase/migrations/002_seed.sql
   ```
3. Go to **Authentication → Users** and create accounts matching the seed users:
   - `admin@warehouse.demo` → password `Demo1234!`
   - `ops@warehouse.demo` → password `Demo1234!`
   - `supervisor@warehouse.demo` → password `Demo1234!`
   - `associate@warehouse.demo` → password `Demo1234!`
4. Note your project's:
   - **Project URL** (Settings → API)
   - **Anon Key** (Settings → API)
   - **JWT Secret** (Settings → API)
   - **Database connection string** (Settings → Database → URI)

---

### Step 2 — Backend

```bash
cd warehouse-backend

# Copy and fill in your env vars
cp .env.example .env
# Edit .env with your Supabase credentials

# Run (env vars loaded via IDE or export them manually)
export SUPABASE_DB_URL=jdbc:postgresql://db.<ref>.supabase.co:5432/postgres
export SUPABASE_DB_USER=postgres
export SUPABASE_DB_PASSWORD=<your-db-password>
export SUPABASE_JWT_SECRET=<your-jwt-secret>

mvn spring-boot:run
```

Backend runs at `http://localhost:8080`

Health check: `GET http://localhost:8080/api/health`

> **Note:** `spring.jpa.hibernate.ddl-auto=validate` — the schema must already exist in Supabase before starting. Run the migrations first.

---

### Step 3 — Frontend

```bash
cd warehouse-frontend

# Install dependencies
npm install

# Copy and fill in env vars
cp .env.example .env
# Edit .env:
# VITE_SUPABASE_URL=https://<ref>.supabase.co
# VITE_SUPABASE_ANON_KEY=<anon-key>
# VITE_API_URL=http://localhost:8080

npm run dev
```

Frontend runs at `http://localhost:5173`

---

## Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| `admin@warehouse.demo` | `Demo1234!` | Admin |
| `ops@warehouse.demo` | `Demo1234!` | OpsManager |
| `supervisor@warehouse.demo` | `Demo1234!` | Supervisor |
| `associate@warehouse.demo` | `Demo1234!` | WarehouseAssociate |

---

## Key Features

### Role-Based Access Control
| Feature | Associate | Supervisor | OpsManager | Admin |
|---------|-----------|------------|------------|-------|
| Report Issue | ✓ | ✓ | ✓ | ✓ |
| View Review Queue | — | ✓ | ✓ | ✓ |
| Assign Tickets | — | ✓ | ✓ | ✓ |
| Approve/Reject Adjustments | — | ✓ | ✓ | ✓ |
| View Dashboard | — | ✓ | ✓ | ✓ |
| View Reports | — | ✓ | ✓ | ✓ |
| Manage Users/Roles | — | — | — | ✓ |
| Manage Master Data | — | — | — | ✓ |

### Business Rules Enforced
- Priority auto-computed from ticket type and estimated value (System Error → Critical, value > $1000 → Critical, etc.)
- Closed tickets cannot be edited (guarded in service layer)
- Only Supervisor/OpsManager/Admin can approve or reject inventory adjustments
- Every workflow action creates an immutable audit log entry
- Tickets must be assigned before moving to In Progress

### REST API
All endpoints at `/api/**`, secured by Supabase JWT. See controllers for full list.

---

## Seed Data Summary

The `002_seed.sql` file contains:
- 4 roles, 7 users across all roles
- 10 warehouse locations (2 warehouses)
- 6 categories, 10 inventory items
- 12 realistic tickets in various statuses (new, pending_review, in_progress, escalated, resolved)
- Discrepancy details and approved adjustments for resolved tickets
- Notes and audit log entries throughout the workflow

---

## Environment Variables Reference

### Backend (`warehouse-backend/.env`)
| Variable | Description |
|----------|-------------|
| `SUPABASE_DB_URL` | JDBC connection string for Supabase Postgres |
| `SUPABASE_DB_USER` | Database user (usually `postgres`) |
| `SUPABASE_DB_PASSWORD` | Database password |
| `SUPABASE_JWT_SECRET` | JWT secret from Supabase Settings → API |
| `PORT` | Server port (default `8080`) |
| `CORS_ORIGINS` | Allowed frontend origins (default `http://localhost:5173`) |

### Frontend (`warehouse-frontend/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_API_URL` | Spring Boot base URL (default `http://localhost:8080`) |

---

## Known Limitations / TODOs

- [ ] File/image upload for evidence attachments (Supabase Storage)
- [ ] Email notifications on ticket assignment/escalation
- [ ] Pagination controls on tickets list (currently returns all)
- [ ] Average resolution time computed from real `closedAt` data (currently static 4.2h)
- [ ] Full-text search across tickets
- [ ] Export to PDF in Reports page (currently CSV only)
- [ ] Supabase Row Level Security (RLS) policies for production hardening
- [ ] Refresh token handling in Axios interceptor for long sessions
