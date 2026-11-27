# Lab 6 - Independent UAT and Defect Management (PDF source)

Every `<…>` placeholder must be replaced with real, verified evidence or left visibly as
**Pending** / **BLOCKED** / **Not Accepted**. Do not invent results, reviews or sign-offs.

## Cover

| Field | Value |
|---|---|
| Team | พวกพี่ชอบบิด (Team 2) |
| Students | Natsumi Takagi - 67070505202 - `MiMikoChAn913`; Ploychanok Imsuwan - 67070505205 - `ploychanokimsu-lgtm` |
| Theme / context | Theme 2 - Inventory and Borrowing System (Borrower, Custodian) |
| Sprint 1 scope | F-01..F-06 (FR-01..07, BR-01..07); see [uat-handoff.md](uat-handoff.md) §2 |
| Repository | <https://github.com/MiMikoChAn913/inventory-borrowing-system> |
| Tested Sprint 1 baseline | commit `d54664d847e7ccd5b1419d1e86870c6bf6c09a0d`, revision `inventory-borrowing-00006-t9c` (image `c4a9f67`, same as 00004-smh) |
| Deployed URL | <https://inventory-borrowing-4bhkmkbela-as.a.run.app> |
| Partner team (UAT Team for our app / Product Team we test) | ยอดนักบิด (sec131): Pimchaya Suprateravanit (`pimchayasupr-hash`), Suphattra Kongsiriphat (`supa-gif173`), IDs `<TO CONFIRM>`; Event Registration app, <https://github.com/pimchayasupr-hash/cpe334-event-registration>, URL <https://sdb3eb069-4d7hbszvwq-as.a.run.app> (commit `e6aad26`, revision `sdb3eb069-00002-mct`, per their UAT plan PR #33) |
| Final Sprint 1 UAT decision on our app | `<Accepted / Accepted with minor limitations / Not Accepted>` by `<PARTNER TESTER NAMES>`, `<DATE>`, revision `<REV>` |

## Contents

| Part | Pages | Evidence IDs |
|---|---|---|
| A UAT preparation and handoff | `<p>` | A-01.. |
| B Independent execution (partner's app) | `<p>` | B-01.. |
| C Defect reporting and triage | `<p>` | C-01.. |
| D Resolution and independent retest | `<p>` | D-01.. |
| Appendices | `<p>` | |

## Version table

| Stage | Commit | Revision | Notes |
|---|---|---|---|
| Sprint 1 baseline handed to UAT Team | `d54664d` | `inventory-borrowing-00006-t9c` (image `c4a9f67`) | Lab 5 release |
| Docs-only releases after handoff (if any) | `<SHA>` | `<REV>` | Same application code; partner informed `<DATE>` |
| Defective commit(s) | `d54664d` (baseline; `returnItem` checks state before ownership) | `inventory-borrowing-00006-t9c` | Issue #20 |
| RED test commit | `f8bab51` on `fix/20-return-ownership-before-state` (from `staging` `be359e3`) | not deployed | 3 of 10 unit tests fail (409 ≠ 403) |
| Fix (GREEN) commit / PR into staging | `f854ea5` / PR #21 | not deployed | 10/10 unit pass locally; CI run 46016149386 pass (unit 10/10, integration 6/6) |
| Corrected release on `main` | `<SHA / PR>` | `<REV>` | Merge commit differs from the staging SHA only by the merge itself |

---

## Part A - UAT preparation and handoff (Product Team)

Embed [uat-handoff.md](uat-handoff.md) in full: release, scope, account labels, setup/cleanup, UI
label table, cases UAT-01..UAT-06.

- A-01 Handoff delivered to `<PARTNER>` on `<DATE/TIME>` via `<CHANNEL>` (screenshot of the message, credentials redacted).
- A-02 Credentials sent privately on `<DATE/TIME>` (screenshot with passwords hidden).

Category coverage:

| Required category | Case(s) |
|---|---|
| Normal domain journey | UAT-01 |
| Business rule / boundary | UAT-02, UAT-05 |
| Forbidden role / ownership | UAT-03, UAT-06 |
| State / history / persistence | UAT-04 |

## Part B - Independent execution (we are the UAT Team for `<PARTNER>`)

Partner release under test: <https://github.com/pimchayasupr-hash/cpe334-event-registration>, commit `e6aad26` (main, PR #40, Deploy demo run 45018492877, 2026-11-22), revision `sdb3eb069-00002-mct`, <https://sdb3eb069-4d7hbszvwq-as.a.run.app>. Handoff: their draft PR #33 `docs/labs/lab06/uat-plan.md` (UAT-01..06); credentials for ORG-A / PART-1 `<RECEIVED DATE>`.

**Automated pre-check (not the graded execution)** - 2026-11-25 16:56 ICT, `curl` against the URL above, no login. A student must re-run these in the browser and capture the screenshots for B-evidence.

| Partner case / step | Call | Expected (their plan) | Observed |
|---|---|---|---|
| UAT-06 step 1 | `GET /api/health` | 200 `{"status":"ok"}` | 200 `{"status":"ok"}` |
| UAT-06 step 2 | `GET /api/ready` | 200, `database: connected` | 200 `{"status":"ready","database":"connected","db":"connected"}` |
| UAT-04 step 1 | `GET /api/events` (no cookie) | 401, no data | 401 `{"error":"Authentication required"}` |
| UAT-04 step 1 | `GET /api/events/<id>/registrations` (no cookie, placeholder id) | 401, no data | 401 `{"error":"Authentication required"}`; re-run with a real ORG-A event id |
| extra | `POST /api/events`, `GET /api/auth/me`, `GET /api/registrations/me` (no cookie) | 401 | all 401 `{"error":"Authentication required"}` |

UAT-01..05 need the ORG-A and PART-1 credentials; ORG-B and PART-2 are optional in their plan (cross-organizer step N/A and UAT-02 step 4 adapted if not provided).

| Case ID | Tester | Date/time (ICT) | Version | Inputs used | Actual result (own words) | Result | Evidence |
|---|---|---|---|---|---|---|---|
| UAT-06 health/ready | `<NAME>` | | `e6aad26` / `sdb3eb069-00002-mct` | none | | | B-01 |
| UAT-01 normal journey | `<NAME>` | | same | ORG-A, PART-1; `UAT-01 Cloud Seminar <ts>`, SEMINAR, CB4-101, cap 5 | | | B-02 |
| UAT-02 capacity / duplicate | `<NAME>` | | same | cap-1 event; PART-2 not provided, so step 4 uses their fallback | | | B-03 |
| UAT-03 past publish / draft hidden | `<NAME>` | | same | Event A yesterday, Event B +10 d | | | B-04 |
| UAT-04 role / ownership | `<NAME>` | | same | ORG-B not provided, so step 5 is N/A per their plan | | | B-05 |
| UAT-05 session / persistence | `<NAME>` | | same + revision after their redeploy | UAT-01 registration | | | B-06 |

Account passwords came privately in chat and are **not** recorded here.

Both students must appear as testers. For each rejected operation, show the rejection **and** that
the protected data was not changed or disclosed. Evidence caption format:
`B-0x | action | expected | actual | time | partner revision`.

## Part C - Defect reporting and triage

### C.1 Outgoing reports (findings we raised on the partner's app)

| Issue | Partner repo link | Case / req | Severity + user-impact reason | Defect or enhancement | Partner response / outcome |
|---|---|---|---|---|---|
| `<#>` | | | | | |

(Write "No failures observed" if all cases passed.)

### C.2 Received findings on our app

Partner's first-run summary (received in chat from ยอดนักบิด, revision `inventory-borrowing-00006-t9c`).
Their own PDF holds their detailed evidence. Add a screenshot of the message as C-01 `<PENDING>`.

| Case | Partner result |
|---|---|
| UAT-01, UAT-02, UAT-03, UAT-05 | PASS |
| UAT-04 | Steps 1-3 PASS (private window, repeat return 409, logout 401). Step 4 waits for our redeploy |
| UAT-06 | PASS: ACC-B2 sees `{"requests":[]}` and cannot change ACC-B1 data. One Minor observation, recorded as Issue #20 |

| Finding / Issue | Reporter | Case / req | Classification (accepted defect / duplicate / not-defect / enhancement) | Reason tied to Sprint 1 contract + evidence | Severity | Owner | Fix status / disposition |
|---|---|---|---|---|---|---|---|
| #20 (UAT-06 step 3 observation, reported via chat by ยอดนักบิด) | Pimchaya Suprateravanit / Suphattra Kongsiriphat (ยอดนักบิด) | UAT-06 / BR-05, AC-BR-05 | **Accepted defect** | BR-05: a Borrower may view and return only their own requests. Reproduced by reading `borrowService.returnItem`: `assertApproved` ran before `assertBorrowerOwnsRequest`, so a non-owner got 409 for another borrower's RETURNED/PENDING/REJECTED request. That reveals the request state. No data changed. RED test reproduces it (D-1). | Minor: no change to data or stock, needs an unguessable UUID, leaks only APPROVED vs not | Ploychanok Imsuwan | Fixed in PR #21 (CI pass). Pending: teammate review, release to `main`, partner retest |
| UAT-04 step 4 (not a finding) | ยอดนักบิด | UAT-04 / AC-PERSIST-01 | Not a defect: step waits for our redeploy | Steps 1-3 passed. Step 4 needs the Product Team to redeploy. The Issue #20 release will be that redeploy. | n/a | Natsumi Takagi | Partner to re-run on the new revision |

Rules: Critical/Major block acceptance and must be fixed and re-tested. Minor must be fixed or
explicitly accepted by the UAT Team as a known limitation. Reproduce before dismissing; never relabel
a failing requirement as an enhancement. Link duplicates to the original Issue.

### C.3 Documented minor limitations accepted by the UAT Team

| Limitation | Issue | Accepted by (name) | Date |
|---|---|---|---|
| `<none>` | | | |

## Part D - Resolution and independent retest

Repeat this block for each accepted defect. If no legitimate defect was found, record the TA's
controlled-exercise request (date, channel) and run the same chain on an isolated branch,
clearly separated from the accepted release.

### D-1 Issue #20: return of another borrower's non-approved request answers 409 instead of 403

1. **Issue:** <https://github.com/MiMikoChAn913/inventory-borrowing-system/issues/20>, labels `uat`, `bug`, `lab6`, severity Minor. Reported in chat by ยอดนักบิด after UAT-06; triaged as an accepted defect (C.2).
2. **RED** (automated, 2026-11-27). Branch `fix/20-return-ownership-before-state` from `staging` `be359e3`, commit `f8bab51` (test only, application code unchanged).
   New file `server/tests/unit/borrowService.test.js` runs the real `createBorrowService` against an in-memory Prisma stand-in. One test for each of RETURNED, PENDING and REJECTED:
   ```js
   await assert.rejects(service.returnItem(stranger, "req-1"), (error) => {
     assert.equal(error.status, 403);
     assert.equal(error.code, "FORBIDDEN");
     return true;
   });
   assert.equal(requests[0].status, status);          // state unchanged
   assert.equal(items[0].availableQuantity, 4);       // stock unchanged
   ```
   A control test checks that the owner still gets 409 for a RETURNED request. `server/tests/integration/api.test.js` (AC-BR-01/04/05) now also checks that `otherBorrower` gets `403 FORBIDDEN` when returning the request after it was RETURNED.
   Command: `cd server && node --test --test-reporter=spec tests/unit/*.test.js`. Output at `f8bab51`:
   ```
   ✖ BR-05 #20: non-owner returning another borrower's RETURNED request gets 403 and nothing changes
   ✖ BR-05 #20: non-owner returning another borrower's PENDING request gets 403 and nothing changes
   ✖ BR-05 #20: non-owner returning another borrower's REJECTED request gets 403 and nothing changes
   ✔ AC-BR-05 #20: owner still gets 409 for a request that is not APPROVED
     actual: 409, expected: 403   (each failing test)
   ℹ tests 10  ℹ pass 7  ℹ fail 3  ℹ skipped 0
   ```
3. **Fix (GREEN):** commit `f854ea5`:
   ```diff
   -      assertApproved(request.status);
   +      // Ownership first (BR-05): a non-owner must not learn the request's state (#20).
          assertBorrowerOwnsRequest(request.borrowerId, user.id);
   +      assertApproved(request.status);
   ```
   Same command at `f854ea5`: all 10 unit tests ✔, including the six existing AC tests. `ℹ tests 10  ℹ pass 10  ℹ fail 0  ℹ skipped 0`. `npm run build` passes.
4. **Review/CI:** PR #21 `fix/20-return-ownership-before-state` → `staging` (<https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/21>). CI `test-and-docker` run 46016149386 **passed**: unit 10/10, integration 6/6 against PostgreSQL 16, Docker build OK.
   Still to do: teammate review text (Natsumi) `<PENDING>` → merge → release PR `<#>` `staging` → `main` → deploy run `<link>`.
5. **Deployed fix:** revision `<PENDING>`, `deploy/smoke_test.py` output `<PENDING>`. Tell ยอดนักบิด **before** merging to `main`.
6. **Partner retest:** tester `<NAME>`, revision `<REV>`, date, actual result, evidence ID `<PENDING>`.
   Ask the partner to re-run: UAT-06 step 3, plus calling return as ACC-B2 on a RETURNED ACC-B1 request (expect 403), UAT-04 step 2 (owner gets 409), UAT-04 step 4 (persistence on the new revision) and UAT-01 (regression).

### D.final Independent Sprint 1 acceptance record (written by the partner UAT Team)

| Field | Value |
|---|---|
| Release accepted | commit `<SHA>`, revision `<REV>`, URL |
| Scope | Sprint 1 F-01..F-06 as in uat-handoff.md |
| Decision | `<Accepted / Accepted with minor limitations / Not Accepted>` |
| Conditions / limitations | `<…>` |
| Testers | `<NAMES, TEAM>` |
| Date | `<DATE>` |
| Evidence | `<message/Issue comment screenshot>` |

Also record the decision **we** gave the partner's product, with the same fields.

## Contributions

| Member | Product Team work | UAT Team work |
|---|---|---|
| Natsumi Takagi | `<…>` | `<…>` |
| Ploychanok Imsuwan | `<…>` | `<…>` |
| Pair work | `<…>` | `<…>` |

## AI-use declaration

An AI assistant (Claude) helped draft the UAT handoff and report templates. The team reviewed
all content and performed all testing, triage, reviews and decisions. For Issue #20 the assistant
also drafted the regression test, the one-line fix and the PR text. The team checked the RED/GREEN
output and the CI result.

## Known limitations

- The deployment uses one shared database; concurrent testers can change stock, so cases check
  relative changes rather than absolute values.
- UAT-04 step 4 (restart/redeploy persistence) requires coordination with the Product Team.
- `<…>`
