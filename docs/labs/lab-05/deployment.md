# Lab 5 Deployment Record

The GitHub deployment workflow is enabled after the GCP variables, Workload Identity
Federation, secrets and the protected `demo` environment were configured. The normal
release path is a reviewed merge to `main`; GitHub Actions authenticates to GCP without
a service-account JSON key. Never paste a secret into this document.

## Stack and resource names

| Component | Choice / team value |
|---|---|
| Application | React + Express in one container |
| Database | PostgreSQL 16 / Prisma |
| Image repository | Artifact Registry `inventory` |
| Runtime | Cloud Run service `inventory-borrowing` |
| Migration/seed | Cloud Run job `inventory-migrate` |
| Persistent database | Cloud SQL instance `inventory-pg`, database `inventory_db` |
| Secret storage | Secret Manager |
| GCP project | `inventory-borrow-cpe334` |
| Region | `asia-southeast1` |
| Public URL | <https://inventory-borrowing-4bhkmkbela-as.a.run.app> |

## Environment variables

| Variable | Purpose | Secret? | Source |
|---|---|:---:|---|
| `DATABASE_URL` | PostgreSQL connection and Cloud SQL socket | Yes | Secret Manager `inventory-database-url` |
| `PORT` | Express listen port; Cloud Run supplies this | No | Cloud Run runtime |
| `NODE_ENV` | Enables production behavior | No | Cloud Run environment |
| `COOKIE_SECURE` | Requires HTTPS-only session cookie in production | No | `true` in Cloud Run |
| `SESSION_TTL_HOURS` | Session expiry duration | No | Environment/default 8 |
| `CLIENT_ORIGIN` | Local client origin documented in `.env.example`; not read by the current server config | No | Local example (`http://localhost:5173`) |
| `SEED_BORROWER_EMAIL` | Demo Borrower login identifier | No | Migration job environment |
| `SEED_BORROWER_PASSWORD` | Demo Borrower password | Yes | Secret Manager |
| `SEED_CUSTODIAN_EMAIL` | Demo Custodian login identifier | No | Migration job environment |
| `SEED_CUSTODIAN_PASSWORD` | Demo Custodian password | Yes | Secret Manager |

## Reproducible commands

```bash
pnpm install --frozen-lockfile
pnpm db:generate
pnpm db:deploy
pnpm db:seed
pnpm test
pnpm build
docker build -t inventory-borrowing:local .
docker compose up --build
```

## First deployment

1. Create the budget alert and verify the selected account/project.
2. Review without changing GCP:

```bash
DRY_RUN=1 PROJECT_ID=<project-id> DB_PASSWORD='<private>' \
SEED_BORROWER_PASSWORD='<private>' SEED_CUSTODIAN_PASSWORD='<private>' \
bash deploy/deploy.sh
```

3. Read every printed resource name and permission. Only then repeat with `DRY_RUN=0`.
4. Record the created resources, revision, URL and tested commit without recording secret values.

## CI and merge gate

- CI file: `.github/workflows/ci-docker.yml`
- Required check name: `test-and-docker`
- PR targets covered: `staging`, `main`
- Main ruleset: require PR, required check, up-to-date branch, empty bypass list.
- Failing temporary PR evidence: [PR #12](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/12), commit `55c309bed4930ebe42f5264b1acb3082cdc048d8`; the required [`test-and-docker` job failed](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/43618860017/job/132519782745).
- Passing PR evidence: [PR #14](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/14) and its [passing CI run](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/43619663615).

## GitHub-to-GCP deployment

The `demo` GitHub environment is restricted to `main` and contains non-secret variables `GCP_PROJECT_ID`, `GCP_REGION`, `WIF_PROVIDER` and `WIF_SERVICE_ACCOUNT`. Authentication uses Workload Identity Federation; no JSON key is stored.

Every normal merge into `main` builds an image tagged with the full commit SHA, resolves its digest, runs the migration job, updates Cloud Run and smoke-tests the URL. A manual workflow with an existing full SHA redeploys that prior image without re-running migrations.

## Running commit

- Release commit SHA: `d54664d847e7ccd5b1419d1e86870c6bf6c09a0d`
- Image tag: same full SHA
- Image digest: `sha256:38bb2834f337ba2b174395709fa89f4fa1a77b6c67af927f67250f86986c4db2`
- Original automatic release revision: `inventory-borrowing-00004-smh`
- Workflow run: [automatic deployment run 44794423519](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/44794423519)
- Verification: WIF authentication, image build/push, migration, Cloud Run update and the public smoke test all passed. The smoke test verified login, authenticated inventory access, health, readiness/database connectivity and HTML.
- Current revision: `inventory-borrowing-00006-t9c`, same SHA and digest; [same-image redeploy run 45003403668](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/45003403668) passed on 22 November 2026. This manual existing-image path skips build and migration and replaces the Cloud Run revision.

## Persistence check

| Step | Evidence |
|---|---|
| Create request and approve it | Borrower created `LAB5-PERSIST-20261121` for Arduino kit (quantity 1) on the public URL; [pending-state screenshot](../../evidence/lab-05/c04-borrower-request-pending.png). Custodian approved the same request; [approved-state screenshot](../../evidence/lab-05/c04-custodian-approved.png). Stock changed from 10/10 to 9/10. |
| Restart Cloud Run revision | [Workflow run 44930813963](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/44930813963) redeployed the same immutable image digest, replacing revision `inventory-borrowing-00004-smh` with `inventory-borrowing-00005-wlk`; WIF authentication, Cloud Run update and smoke test passed. |
| Retrieve the same request | [Post-redeploy screenshot](../../evidence/lab-05/c05-after-redeploy-persisted.png) shows `LAB5-PERSIST-20261121` still approved with quantity 1 and Arduino stock still 9/10 after the new revision served traffic. |
| Deploy a reviewed visible change | [Issue #13](https://github.com/MiMikoChAn913/inventory-borrowing-system/issues/13) -> [PR #14 into `staging`](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/14) -> [PR #15 into `main`](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/15) -> [deploy run](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/44794423519), revision `inventory-borrowing-00004-smh`. |
| Redeploy the accepted image a second time | [Run 45003403668](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/45003403668) created revision `inventory-borrowing-00006-t9c` using the same digest; WIF authentication, Cloud Run update and public smoke checks passed. |
| Retrieve the same request again | **Pending screenshot:** refresh the public URL after the second replacement and capture `LAB5-PERSIST-20261121` as approved. The prior two screenshots match on unique purpose label, status, quantity, borrower and stock, proving persistence through the first revision replacement; the second run's smoke test does not query this individual request. |

Cloud Run application replacement was exercised by deploying the same immutable image into a fresh revision; no independent restart-only command was run. The screenshots identify the record by its unique purpose label because the UI does not display its internal request ID.

## Release procedure

1. Complete labelled Issue on a branch from `staging`.
2. Open PR into `staging`; teammate performs specific review; CI passes; merge.
3. Open release PR from `staging` into `main`; teammate reviews; required CI passes.
4. Merge. `deploy.yml` builds and deploys the exact merge commit.
5. Confirm the Actions run, image digest, Cloud Run revision and smoke test.
6. Record the release SHA and evidence links.

## Known differences from the Starter Kit

- The app is BorrowBox rather than TokTickIT.
- API smoke checks use `/api/health`, `/api/ready`, `/` and authenticated `/api/items`.
- The migration job safely re-runs seed upserts using passwords supplied only through Secret Manager.
- The CI uses pnpm workspaces and Node's test runner.
