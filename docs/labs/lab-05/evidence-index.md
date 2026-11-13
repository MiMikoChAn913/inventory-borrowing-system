# Lab 5 PDF Evidence Index Template

Use this file to collect evidence while working. The submitted PDF must use headings Answer Part 0 through Answer Part 4 and direct links to the team's real artifacts.

## Answer Part 0 - Team and Evidence Index

- Team: พวกพี่ชอบบิด
- Students, IDs and GitHub usernames: `<TEAM VALUES>`
- Public repository: <https://github.com/MiMikoChAn913/inventory-borrowing-system>
- Submitted tag/full commit: `<SHA>`
- Public service: `<URL>`
- Running commit/revision: `<SHA / CLOUD RUN REVISION>`

| Rubric part | Artifact/direct link | Check/requirement and version | Verification result |
|---|---|---|---|
| 1 | `<PR + ACTIONS RUN>` | C-01 / `<SHA>` | `<RESULT>` |
| 1 | `<FAILING PR>` | C-02 / `<SHA>` | Required check failed; merge blocked |
| 2 | `<FILES + BUILD RUN>` | C-03 / `<SHA>` | `<RESULT>` |
| 3 | `<PUBLIC URL + EVIDENCE>` | C-04/C-05 / `<SHA>` | `<RESULT>` |
| 4 | `<ISSUE, PRS, DEPLOY RUN>` | C-06 / `<SHA>` | `<RESULT>` |

## Answer Part 1 - CI and Quality Gate

- CI workflow: `.github/workflows/ci-docker.yml`
- Passing PR and meaningful test summary: `<LINKS>`
- Main required-check setting: `<CAPTIONED SCREENSHOT>`
- Normal temporary failing PR with blocked merge: `<LINK + CAPTIONED SCREENSHOT>`

## Answer Part 2 - Docker and Reproducible Configuration

- Dockerfile and `.dockerignore`: `<DIRECT LINKS>`
- Clean-clone build/run command and output: `<EVIDENCE>`
- `.env.example` and environment-variable table: `<DIRECT LINKS>`

## Answer Part 3 - GCP Deployment and Persistence

- Public URL and domain journey: `<URL + CAPTIONED SCREENSHOTS>`
- Cloud Run service, Cloud SQL and revision: `<EVIDENCE>`
- Same database record before restart, after restart and after redeploy: `<CAPTIONED SCREENSHOTS>`

## Answer Part 4 - Repeatable Release Pipeline

- Labelled Issue → feature PR into `staging` → release PR into `main`: `<LINKS>`
- Specific teammate reviews: `<LINKS>`
- CI and deployment run: `<LINKS>`
- Running revision matching commit: `<EVIDENCE>`
- Release procedure: `deployment.md`

## Local pre-deployment verification

- Verified on 13 November 2026: borrower submitted a request, custodian approved it, and borrower returned the item.
- The application container was restarted; the health endpoint returned HTTP 200 and the request remained `RETURNED` in PostgreSQL.
- [Borrower returned-item screenshot](../../evidence/local/borrower-returned.png)
- This local check supports development only; replace or supplement it with the required public GCP evidence before submission.
