# Part E - Sprint 1 Software Test Specification

| Test ID | AC | Level | Preconditions/input | Action | Expected result |
|---|---|---|---|---|---|
| TEST-U01 | AC-BR-02 | Unit | Quantity 0, -1, 1.5 or NaN | Validate request quantity | `BAD_REQUEST` for every invalid value. |
| TEST-U02 | AC-BR-03 | Unit | Available 1; request 2 | Validate availability | `CONFLICT`; caller cannot approve. |
| TEST-U03 | AC-BR-04 | Unit | Status `APPROVED` | Assert pending transition | `CONFLICT`. |
| TEST-U04 | AC-BR-05 | Unit | Request owner A; current user B | Assert request ownership | `FORBIDDEN`. |
| TEST-I01 | AC-AUTH-01 | API/DB integration | No session | GET `/api/items` | 401, no items returned. |
| TEST-I02 | AC-AUTH-02 | API/DB integration | Seeded users | Login with invalid and valid passwords | Invalid 401; valid session cookie is HttpOnly. |
| TEST-I03 | AC-AUTH-03 | API/DB integration | Borrower session | POST `/api/items` | 403 and no item created. |
| TEST-I04 | AC-BR-01,04,05; AC-PERSIST-01 | API/DB integration | Item quantity 2; both roles signed in | Request 1, approve, return, query DB | States persist; stock 2→1→2. |
| TEST-I05 | AC-BR-03 | API/DB integration | Pending request 2; current stock reduced to 1 | Approve request | 409; stock remains 1. |
| TEST-I06 | AC-AUTH-04 | API/DB integration | Valid Borrower session | Logout then GET `/api/auth/me` | 204 then 401. |
| TEST-CI01 | AC-BUILD-01 | Build/system | Clean GitHub runner and PostgreSQL service | Install, migrate, test, build, Docker build | Required `test-and-docker` job passes. |
| TEST-SMOKE01 | AC-OPS-01 | Live smoke | Deployed Cloud Run URL | Check health, readiness, HTML and optional login/items | All configured checks return expected values. |

Actual local/CI results must be recorded with the tested commit in the submission evidence. The committed tests are the executable source of truth; this table is the planned contract.
