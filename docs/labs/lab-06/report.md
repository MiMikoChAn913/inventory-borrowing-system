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
| Tested Sprint 1 baseline | commit `d54664d847e7ccd5b1419d1e86870c6bf6c09a0d`, revision `inventory-borrowing-00004-smh` |
| Deployed URL | <https://inventory-borrowing-4bhkmkbela-as.a.run.app> |
| Partner team (UAT Team for our app / Product Team we test) | ยอดนักบิด (sec131): Pimchaya Suprateravanit (`pimchayasupr-hash`), Suphattra Kongsiriphat (`supa-gif173`), IDs `<TO CONFIRM>`; Event Registration app, <https://github.com/pimchayasupr-hash/cpe334-event-registration>, URL `<PENDING THEIR DEPLOY>` |
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
| Sprint 1 baseline handed to UAT Team | `d54664d` | `inventory-borrowing-00004-smh` | Lab 5 release |
| Docs-only releases after handoff (if any) | `<SHA>` | `<REV>` | Same application code; partner informed `<DATE>` |
| Defective commit(s) | `<SHA or "none found">` | | |
| RED test commit | `<SHA>` | | |
| Fix (GREEN) commit / PR into staging | `<SHA / PR>` | | |
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

Partner release under test: `<REPO, COMMIT/TAG, REVISION, URL>`; handoff received `<DATE>`.

| Case ID | Tester | Date/time (ICT) | Version | Inputs used | Actual result (own words) | Result | Evidence |
|---|---|---|---|---|---|---|---|
| `<ID>` | `<NAME>` | | | | | PASS / FAIL / BLOCKED (reason) | B-0x |

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

| Finding / Issue | Reporter | Case / req | Classification (accepted defect / duplicate / not-defect / enhancement) | Reason tied to Sprint 1 contract + evidence | Severity | Owner | Fix status / disposition |
|---|---|---|---|---|---|---|---|
| `<#>` | | | | | | | |

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

### D-<n> `<Issue #, title>`

1. **Issue:** `<link>`, label `uat` + `bug`, severity `<…>`.
2. **RED:** test file/name `<server/tests/...>`, assertion excerpt, command
   `pnpm --filter server test:<unit|integration>`, commit `<SHA>`, output showing the failure
   (pass/fail/skip counts).
3. **Fix (GREEN):** code diff excerpt, same command and commit `<SHA>`, output showing pass, plus the full
   suite result (counts).
4. **Review/CI:** fix branch from `staging` → PR `<#>` with teammate review text → CI `test-and-docker`
   run `<link>` → release PR `<#>` into `main` → deploy run `<link>`.
5. **Deployed fix:** revision `<REV>`, smoke check output.
6. **Partner retest:** tester `<NAME>`, revision `<REV>`, date, actual result, evidence ID; affected UAT
   cases re-run: `<IDs and results>`.

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

Claude (Anthropic) was used to draft the UAT handoff cases from the Sprint 1 contract, to check each
expected result against the server code, and to prepare this report template and the UAT issue
template. The team reviewed and edited the drafts and performed all testing, triage decisions,
reviews and acceptance decisions. `<add any further AI use>`

## Known limitations

- The deployment uses one shared database; concurrent testers can change stock, so cases check
  relative changes rather than absolute values.
- UAT-04 step 4 (restart/redeploy persistence) requires coordination with the Product Team.
- `<…>`
