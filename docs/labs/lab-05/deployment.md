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
- Cloud Run revision: `inventory-borrowing-00004-smh`
- Workflow run: [automatic deployment run 44794423519](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/44794423519)
- Verification: WIF authentication, image build/push, migration, Cloud Run update and the public smoke test all passed. The smoke test verified login, authenticated inventory access, health, readiness/database connectivity and HTML.

## Persistence check

| Step | Evidence |
|---|---|
| Create request and approve it | **Pending public capture:** Borrower creates a request and Custodian approves it on the public URL. Record the request ID and release SHA. |
| Restart Cloud Run revision | **Pending public capture:** restart/redeploy from Cloud Run and capture the new instance/revision evidence without exposing secrets. |
| Retrieve the same request | **Pending public capture:** show the same request ID and state after restart. |
| Deploy a reviewed visible change | [Issue #13](https://github.com/MiMikoChAn913/inventory-borrowing-system/issues/13) -> [PR #14 into `staging`](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/14) -> [PR #15 into `main`](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/15) -> [deploy run](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/44794423519), revision `inventory-borrowing-00004-smh`. |
| Retrieve the same request again | **Pending public capture:** show the same request ID after the reviewed redeploy. |

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
