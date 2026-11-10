# BorrowBox - Inventory and Borrowing System

BorrowBox is the Sprint 1 application for team **พวกพี่ชอบบิด** in CPE 334. It implements the Theme 2 domain journey with two real roles:

- **Borrower**: signs in, sees available inventory, submits a borrow request, tracks its status and returns approved items.
- **Custodian**: signs in, creates inventory items and approves or rejects pending requests.

The backend enforces permissions and business rules. The React UI never selects a user ID or role on behalf of the server.

## Technology

- React 19 and Vite
- Node.js 24 and Express 5
- PostgreSQL 16 and Prisma 6
- Server-side opaque sessions stored as SHA-256 token hashes
- Node test runner, Supertest and a real PostgreSQL integration database
- Docker, GitHub Actions and Google Cloud Run/Cloud SQL deployment templates

## Repository map

```text
client/                     React web application
server/src/                 API, authentication and domain services
server/prisma/              schema, migration and safe seed
server/tests/               unit and PostgreSQL integration tests
docs/                       SRS, SDS, plans, contracts and Lab 5 notes
deploy/                     first deploy, release, smoke test and teardown
.github/workflows/          pull-request CI and main deployment pipeline
```

## Local setup

Requirements: Node.js 24, pnpm 11 and Docker Desktop.

1. Copy `.env.example` to `.env`.
2. Replace both seed passwords with local values of at least eight characters. Do not commit `.env`.
3. Start the full stack:

```bash
docker compose up --build
```

4. Open `http://localhost:3000` and sign in with one of the seed emails and the corresponding password from your private `.env`.

The PostgreSQL data is stored in the named volume `inventory_pgdata`, so it survives application-container recreation. Do not delete the volume when collecting persistence evidence.

## Development without the app container

Start only PostgreSQL, then run the application with file watching:

```bash
docker compose up -d postgres
pnpm install
pnpm db:generate
pnpm db:deploy
pnpm db:seed
pnpm dev
```

The UI is at `http://localhost:5173`; Vite proxies `/api` to port 3000.

## Verification

```bash
pnpm test:unit
pnpm test:integration
pnpm build
docker build -t inventory-borrowing:local .
```

Integration tests require `DATABASE_URL` to point at a migrated disposable PostgreSQL database. CI creates one automatically.

## Branch and review workflow

1. Create or update a labelled GitHub Issue.
2. Branch from `staging` using names such as `feature/F-03-borrow-request`.
3. Record or update the contract and tests before the implementation when practical.
4. Open a PR into `staging`; the other teammate performs a specific review.
5. Open the reviewed release PR from `staging` into `main`.
6. CI must pass before merge. A merge to `main` is a release and triggers deployment.

Do not invent historical Issues, reviews or screenshots. Create them through the team's real GitHub activity so the evidence is credible.

## Security notes

- No `.env`, database URL, password or service-account key belongs in Git.
- Session cookies are `HttpOnly`, `SameSite=Lax`, and `Secure` in production.
- Passwords are hashed with bcrypt.
- The deploy workflow uses Workload Identity Federation rather than a JSON service-account key.
- GCP secret values come from Secret Manager.

## Documents

- [SRS](docs/srs.md)
- [Features](docs/features.md) and [traceability](docs/traceability.md)
- [System-level SDS](docs/system-sds.md)
- [Three-sprint plan](docs/sprints/plan.md)
- [Sprint 1 feature contract](docs/sprints/sprint-1/inventory-borrowing.md)
- [Sprint 1 STS](docs/sprints/sprint-1/sts.md)
- [Lab 5 deployment record template](docs/labs/lab-05/deployment.md)
