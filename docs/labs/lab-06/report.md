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
| Corrected release on `main` | `7a737a4` (merge of release PR #22; same tree as GREEN `f854ea5`) | `inventory-borrowing-00007-kxx` (image digest `sha256:48236a1c…ee533`) | Deploy demo run 46029433147, 2026-11-27 23:01 ICT; smoke PASS. Merge commits add no code changes |

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

## Part B - Independent execution (we are the UAT Team for ยอดนักบิด, sec131)

Partner release under test: <https://github.com/pimchayasupr-hash/cpe334-event-registration>, commit `e6aad26` (main, PR #40, Deploy demo run 45018492877, 2026-11-22), revision `sdb3eb069-00002-mct`, <https://sdb3eb069-4d7hbszvwq-as.a.run.app>. Handoff: their UAT plan `docs/labs/lab06/uat-plan.md` on branch `lab6/28-uat-plan` (UAT-01..06), plus ORG-A / PART-1 credentials received privately in chat. The passwords are **not** recorded here.

**How it was executed.** Ploychanok Imsuwan states that the instructor allowed the AI assistant to perform Part B for our team. Under that permission, Claude (AI assistant) ran every step of the partner's plan on 2026-11-27, 22:08:58-22:09:03 ICT. It used the deployed API with a script, `evidence/partner-uat.mjs`, that keeps the session cookie for each account the way the browser does. Every request and its full response is kept in `evidence/B-partner-uat-run-20261127.log` (passwords redacted). The run used the API, not the browser UI, so it covers the server behaviour each case asserts, not the look of the screens. Run tag `T2-20261127T1508`, which appears in every synthetic event title.

Earlier unauthenticated pre-check, 2026-11-25 16:56 ICT (`curl`): health 200, ready 200 `database: connected`, and `GET /api/events`, `POST /api/events`, `GET /api/auth/me`, `GET /api/registrations/me` without a cookie all return 401.

| Case ID | Executed by | Date/time (ICT) | Version | Inputs used | Actual result (observed) | Result | Evidence |
|---|---|---|---|---|---|---|---|
| UAT-06 health/ready | Claude (AI) for Team 2 | 2026-11-27 22:09:00 | `e6aad26` / `sdb3eb069-00002-mct` | none | `/api/health` 200 `{"status":"ok"}`; `/api/ready` 200 `{"status":"ready","database":"connected","db":"connected"}` | PASS | B-01 |
| UAT-01 normal journey | Claude (AI) for Team 2 | 22:09:01-22:09:01 | same | ORG-A, PART-1; `UAT-01 Cloud Seminar T2-20261127T1508`, SEMINAR, Room CB4-101, cap 5, start +7 d | Create 201 DRAFT, then publish 200 PUBLISHED. PART-1 catalog showed it with 5 seats. Register 201, after which remainingSeats was 4. My Registrations listed it as ACTIVE. ORG-A roster 200 listed "Somchai Student", participant@kmutt.ac.th, ACTIVE, with no `passwordHash` | PASS | B-02 |
| UAT-02 capacity / duplicate / floor | Claude (AI) for Team 2 | 22:09:01-22:09:02 | same | `UAT-02 Cap-1 Workshop T2-…`, cap 1 | Publish 200. PART-1 register 201, remainingSeats 0. Second register 409 "Already registered for this event". Capacity → 0 gave 400 "Capacity must be an integer between 1 and 500". Re-read: capacity 1, 1 active. Step 4 (PART-2 on a full event) not run: PART-2 not provisioned, and their plan allows the fallback | PASS (step 4 N/A per plan) | B-03 |
| UAT-03 past publish / draft hidden | Claude (AI) for Team 2 | 22:09:02 | same | Event A start −1 d; Event B start +10 d kept DRAFT | Publish A 400 "Cannot publish event: startAt must be in the future", and A stayed DRAFT. Neither A nor B was in PART-1's catalog. PART-1 `GET` B 404, register on B 404 "Event not available for registration". ORG-A roster of B: 0 registrations | PASS | B-04 |
| UAT-04 role / ownership / sensitive data | Claude (AI) for Team 2 | 22:09:02-22:09:03 | same | UAT-01 event `6d97d66d-…` | Anonymous `/api/events` and roster both 401 with no data. PART-1 login body `{user:{id,email,name,role}}` had no `passwordHash`. PART-1 `POST /api/events` 403, and ORG-A's event count stayed 7 → 7. PART-1 roster 403 with no roster data. ORG-A register 403, ORG-A `/registrations/me` 403. Step 5 N/A: ORG-B not provisioned | PASS (step 5 N/A per plan) | B-05 |
| UAT-05 session / persistence | Claude (AI) for Team 2 | 22:09:03 | same | PART-1; UAT-01 registration | `/auth/me` 200 twice, so the session persisted. Logout 200, then `/auth/me` 401. After logging back in, My Registrations shows the UAT-01 registration ACTIVE. **Steps 4-5 not yet run**: they need the Product Team's restart/redeploy | Steps 1-3 PASS; steps 4-5 **PENDING** (waiting on partner) | B-06 |

Rejected operations were checked for side effects. UAT-02: capacity and active count unchanged. UAT-03: Event A still DRAFT, Event B has 0 registrations. UAT-04: organizer event count unchanged, and no roster data in the 403 bodies.

After their redeploy, re-check: log in as PART-1, open My Registrations, and confirm that `UAT-01 Cloud Seminar T2-20261127T1508` (event `6d97d66d-e014-4340-9113-4fd27ef83a9d`) is still ACTIVE, then record the new revision.

Data left on the partner deployment, all synthetic and tagged `T2-20261127T1508`: 4 events (UAT-01, UAT-02 published; UAT-03 Past/Future drafts) and 2 PART-1 registrations. Sprint 1 has no deletion feature.

## Part C - Defect reporting and triage

### C.1 Outgoing reports (findings we raised on the partner's app)

| Issue | Partner repo link | Case / req | Severity + user-impact reason | Defect or enhancement | Partner response / outcome |
|---|---|---|---|---|---|
None. No failures were observed in UAT-01..06 on `sdb3eb069-00002-mct`, so no issues were raised on the partner repository. Two steps were N/A under their own plan (UAT-02 step 4, UAT-04 step 5), which is not a defect.

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
   Natsumi approved PR #21 after re-running RED/GREEN locally. Merged into `staging` as `de4ff93`. Release PR #22 `staging` → `main`: CI run 46021446652 passed. Natsumi approved release PR #22 and noted that its head tree matches GREEN `f854ea5`. It was merged to `main` as `7a737a4`. Deploy demo run 46029433147 succeeded (test-and-docker, then deploy).
5. **Deployed fix:** revision `inventory-borrowing-00007-kxx`, URL unchanged. Post-deploy smoke test (`deploy/smoke_test.py` in run 46029433147, 2026-11-27 23:01 ICT):
   ```
   PASS login and authenticated inventory read
   PASS health, readiness/database, and HTML
   ```
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

### D.partner Our decision on ยอดนักบิด's Sprint 1 release (we are the UAT Team)

| Field | Value |
|---|---|
| Release tested | commit `e6aad26`, revision `sdb3eb069-00002-mct`, <https://sdb3eb069-4d7hbszvwq-as.a.run.app> |
| Scope | Sprint 1 F-01..F-04 per their uat-plan.md |
| Decision | **Pending.** UAT-01..04 and UAT-06 PASS, UAT-05 steps 1-3 PASS. Steps 4-5 (persistence after redeploy) are not run yet. If they pass: Accepted |
| Conditions | UAT-02 step 4 and UAT-04 step 5 N/A (PART-2/ORG-B not provisioned, as their plan allows) |
| Executed by | Claude (AI assistant) for พวกพี่ชอบบิด (Natsumi Takagi, Ploychanok Imsuwan), with instructor permission as reported by Ploychanok |
| Date | 2026-11-27 |
| Evidence | B-01..B-06, `evidence/B-partner-uat-run-20261127.log` |

## Contributions

| Member | Product Team work | UAT Team work |
|---|---|---|
| Natsumi Takagi | `<…>` | `<…>` |
| Ploychanok Imsuwan | `<…>` | `<…>` |
| Pair work | `<…>` | `<…>` |

## AI-use declaration

An AI assistant (Claude) helped draft the UAT handoff and report templates. The team reviewed
all content and made the triage, review and acceptance decisions. **Part B was executed by Claude**
(API script and log in `evidence/`), with instructor permission as reported by Ploychanok Imsuwan.
For Issue #20 the assistant
also drafted the regression test, the one-line fix and the PR text. The team checked the RED/GREEN
output and the CI result.

## Known limitations

- The deployment uses one shared database; concurrent testers can change stock, so cases check
  relative changes rather than absolute values.
- UAT-04 step 4 (restart/redeploy persistence) requires coordination with the Product Team.
- `<…>`
