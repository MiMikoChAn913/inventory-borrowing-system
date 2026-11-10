# Part F - Working Sprint 1 and Verification Evidence

This is a collection template, not a substitute for real execution evidence. Replace every placeholder with evidence from the submitted release commit and keep failures/limitations visible.

## Release identity

- Team: พวกพี่ชอบบิด
- Repository: `<PUBLIC REPOSITORY URL>`
- Release tag/commit: `<IMMUTABLE TAG OR FULL SHA>`
- Tested date/time: `<ASIA/BANGKOK>`

## Demonstration scenarios

| Scenario | Feature / AC | Role and starting condition | Expected and actual result | Evidence |
|---|---|---|---|---|
| Normal borrow lifecycle | F-03..05 / AC-BR-01,04,05 | Borrower and Custodian; item has stock | Pending → Approved → Returned; stock restored | `<CAPTIONED SCREENSHOTS>` |
| Rule rejection | F-04 / AC-BR-03 | Pending quantity exceeds current stock | Approval rejected; stock unchanged | `<CAPTIONED SCREENSHOT + TEST>` |
| Access restriction | F-06 / AC-AUTH-03 | Borrower calls create-item API | 403; no item created | `<API TEST OUTPUT>` |
| Login/logout | F-01 / AC-AUTH-02,04 | Seeded test account | Valid login succeeds; logout invalidates session | `<CAPTIONED SCREENSHOTS + TEST>` |

## Build and automated tests

| Command | Tested commit | Pass/fail/skip counts | Evidence |
|---|---|---|---|
| `pnpm test:unit` | `<SHA>` | `<COUNTS>` | `<READABLE OUTPUT>` |
| `pnpm test:integration` | `<SHA>` | `<COUNTS>` | `<READABLE OUTPUT>` |
| `pnpm build` | `<SHA>` | `<RESULT>` | `<READABLE OUTPUT>` |
| `docker build -t inventory-borrowing:<SHA> .` | `<SHA>` | `<RESULT>` | `<READABLE OUTPUT>` |

Include two short code excerpts in the submitted PDF: one from `borrowRules.test.js` for insufficient stock and one from `api.test.js` for a forbidden role/ownership operation. Include their matching execution result; do not paste entire files.

## Engineering workflow

| Issue | Contract / feature | Branch and author | PR and reviewer | Specific review and integration result |
|---|---|---|---|---|
| `<ISSUE>` | `<F/AC IDs>` | `<BRANCH / MEMBER>` | `<PR / OTHER MEMBER>` | `<WHAT WAS CHECKED>` |
| `<ISSUE>` | `<F/AC IDs>` | `<BRANCH / MEMBER>` | `<PR / OTHER MEMBER>` | `<WHAT WAS CHECKED>` |

## Contributions and AI-use declaration

| Member | Meaningful contributions | Issue/PR links |
|---|---|---|
| `<MEMBER 1>` | `<DESIGN, TEST, IMPLEMENTATION, REVIEW, DEPLOYMENT>` | `<LINKS>` |
| `<MEMBER 2>` | `<DESIGN, TEST, IMPLEMENTATION, REVIEW, DEPLOYMENT>` | `<LINKS>` |

AI-assisted code and documentation must be reviewed by both students. Record the tools used and the human checks performed. Do not claim an Issue, PR, review, TDD sequence, CI run or deployment that did not actually occur.

## Known limitations

- Borrower reports a return directly; separate Custodian return confirmation is planned for Sprint 2.
- Inventory is quantity-based and does not yet track individual serial-numbered assets.
- `<ADD EVERY FAILED/SKIPPED TEST OR INCOMPLETE FEATURE>`
