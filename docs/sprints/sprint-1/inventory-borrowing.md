# Part E - Sprint 1 Engineering Contract

## Contract identity

- Features: F-01 through F-06
- Linked requirements: FR-01..07, BR-01..07 and NFR-01..05
- Actors: Borrower and Custodian
- Version: 1.0 baseline created with the implementation; future contract changes must be committed visibly rather than overwriting history.

## Normal workflow

1. Borrower logs in and retrieves the inventory catalogue.
2. Borrower selects an available item, positive quantity and purpose.
3. Server records a `PENDING` request without decrementing stock.
4. Custodian logs in, views the request and approves it.
5. In one database transaction, the server verifies current stock, decrements it and records `APPROVED` with reviewer/time.
6. Borrower retrieves the approved request and reports the return.
7. In one transaction, the server restores stock and records `RETURNED`.

## Failure and boundary behavior

- Invalid credentials do not create a session.
- Missing/expired sessions cannot access protected endpoints.
- Borrowers cannot add inventory or review requests.
- Custodians cannot submit borrower requests.
- Zero, fractional, negative or excessive quantities are rejected.
- An already reviewed request cannot be reviewed again.
- Another borrower cannot view or return a request they do not own.
- Rejection without a reason is rejected.

## Acceptance criteria

| ID | Observable expected outcome |
|---|---|
| AC-AUTH-01 | An unauthenticated request to a protected endpoint receives 401 and no private data. |
| AC-AUTH-02 | Valid seeded credentials create a server-side session; invalid credentials receive 401. |
| AC-AUTH-03 | A role-forbidden operation receives 403 even if called directly through the API. |
| AC-AUTH-04 | Logout deletes the session, and its cookie no longer authorizes `/api/auth/me`. |
| AC-INV-01 | Authenticated users see active items with total and available quantities. |
| AC-INV-02 | A Custodian can add positive stock; a Borrower cannot. |
| AC-BR-01 | A Borrower can create a positive request within currently available stock. |
| AC-BR-02 | Zero, negative, fractional or malformed quantities are rejected and nothing is stored. |
| AC-BR-03 | Approval fails when current stock is insufficient and stock remains unchanged. |
| AC-BR-04 | A Custodian can approve or reject only `PENDING` requests; rejection records a reason. |
| AC-BR-05 | Only the owning Borrower can return an `APPROVED` request; stock is restored exactly once. |
| AC-BR-06 | A Borrower list contains only that Borrower's requests; Custodian list contains all requests. |
| AC-PERSIST-01 | A completed request and its stock values are retrievable from PostgreSQL after process/container restart. |
| AC-BUILD-01 | Clean locked install, tests, production build and Docker build all pass. |
| AC-OPS-01 | Live health, database readiness and HTML smoke checks pass. |

## Product Definition of Done

- Required behavior and backend authorization are implemented.
- Planned unit and PostgreSQL integration tests pass on the release commit.
- Production client and server build successfully; Docker image builds from a clean clone.
- Feature work has a labelled Issue, feature branch and teammate-reviewed PR into `staging`.
- The release PR from `staging` into `main` passes the required CI check.
- README, `.env.example`, migrations, seed and engineering documents match the release.
- Known incomplete work and failed/skipped tests are disclosed.
- No secret or real personal data appears in Git, logs, screenshots or the submitted PDF.
