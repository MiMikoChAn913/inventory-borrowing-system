# Part A - Software Requirements Specification

## Stakeholder problem and context

The equipment custodian currently cannot see all borrowing activity and stock availability in one reliable place. Borrowers need a clear way to request equipment and track decisions, while custodians need to review requests without allowing stock to become negative.

## Actors and responsibilities

| Actor | Responsibilities |
|---|---|
| Borrower | Sign in, view inventory, request an available quantity, view only their own requests, and return their own approved items. |
| Custodian | Sign in, add inventory, view all requests, and approve or reject pending requests. |

## Product scope

Sprint 1 covers authenticated inventory browsing and a complete request lifecycle: pending, approved/rejected and returned. It includes persistent storage, backend authorization and meaningful automated verification.

Explicit exclusions for Sprint 1 are self-registration, password recovery, item images/uploads, reservations by date, overdue fines, notifications, audit export and destructive inventory deletion.

## Functional requirements

| ID | Requirement |
|---|---|
| FR-01 | A seeded user can log in, retrieve their current identity and log out. |
| FR-02 | An authenticated user can list active items and see total and available quantities. |
| FR-03 | A Borrower can submit a request for a positive available quantity with a purpose. |
| FR-04 | A Borrower can see their own requests and their current states. |
| FR-05 | A Custodian can view all requests and approve or reject a pending request. |
| FR-06 | A Borrower can return their own approved request, restoring available stock. |
| FR-07 | A Custodian can add a new inventory item with a positive initial quantity. |

## Business rules

| ID | Rule |
|---|---|
| BR-01 | Request and inventory quantities are positive whole numbers. |
| BR-02 | Approval is rejected if the requested quantity exceeds current available stock; stock never becomes negative. |
| BR-03 | Only a `PENDING` request can be approved or rejected. |
| BR-04 | Only the Custodian role may create inventory or review requests. |
| BR-05 | A Borrower can view and return only their own requests. |
| BR-06 | Only an `APPROVED` request can be returned, and each request can be returned once. |
| BR-07 | Rejection requires a recorded reason. |

## Non-functional requirements

| ID | Measurable target | Verification |
|---|---|---|
| NFR-01 Security | Unauthenticated protected API requests return 401; forbidden role operations return 403 without private data. | API integration tests. |
| NFR-02 Persistence | Items and requests remain after application restart and redeploy. | PostgreSQL integration test and Lab 5 before/after evidence. |
| NFR-03 Reproducibility | A clean clone builds from the committed lockfile and documented environment variables. | CI install, build and Docker build. |
| NFR-04 Availability | `/api/health` and database-aware `/api/ready` return 200 when healthy. | CI/live smoke test. |
| NFR-05 Usability | Core screens work from 320 px to desktop width with labelled controls and visible states. | Responsive browser inspection. |
| NFR-06 Delivery safety | Every relevant PR runs automated tests and a production Docker build before merge. | Required GitHub Actions check. |

## Assumptions and decisions

- Every physical item type is tracked by quantity rather than individual asset serial number in Sprint 1.
- Approval, not request creation, is the authoritative stock allocation point.
- A borrower reports a return directly in Sprint 1. Custodian return confirmation is planned for Sprint 2.
- Accounts are seeded; public self-registration is intentionally excluded.
- PostgreSQL is the durable source of truth. Containers contain no required runtime data.
