# Part B - Requirements Traceability

| Requirement | Feature/responsibility | Acceptance criteria | Verification | Sprint |
|---|---|---|---|---|
| FR-01 | F-01 Authentication | AC-AUTH-01..04 | `server/tests/integration/api.test.js` | 1 |
| FR-02 | F-02 Inventory catalogue | AC-INV-01 | Integration API and UI journey | 1 |
| FR-03, BR-01 | F-03 Borrow request | AC-BR-01, AC-BR-02 | Unit and integration tests | 1 |
| FR-04, BR-05 | F-03 Borrow request | AC-BR-06 | API ownership test and UI journey | 1 |
| FR-05, BR-02, BR-03, BR-07 | F-04 Request review | AC-BR-03, AC-BR-04 | Unit and integration tests | 1 |
| FR-06, BR-05, BR-06 | F-05 Return | AC-BR-05 | Unit and integration tests | 1 |
| FR-07, BR-04 | F-06 Inventory administration | AC-INV-02 | API role test and UI journey | 1 |
| NFR-01 | Authentication and route guards | AC-AUTH-01..04 | API integration tests | 1 |
| NFR-02 | PostgreSQL repository | AC-PERSIST-01 | DB assertions; restart/redeploy evidence | 1/Lab 5 |
| NFR-03 | Build responsibility | AC-BUILD-01 | GitHub Actions and Docker build | Lab 5 |
| NFR-04 | Health responsibility | AC-OPS-01 | `deploy/smoke_test.py` | Lab 5 |
| NFR-05 | React UI | AC-UI-01 | Responsive visual inspection | 1 |
| NFR-06 | CI responsibility | AC-CI-01 | Required `test-and-docker` check | Lab 5 |

No baseline Sprint 1 requirement is intentionally uncovered. Later-sprint features are listed in `features.md` and do not claim implementation.
