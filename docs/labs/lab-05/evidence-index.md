# Lab 5 PDF Evidence Index

This file is the source checklist for the PDF. It records verified evidence and the
project board's creation-date/access limitations. The PDF uses headings Answer Part 0 through Answer Part 4.

## Answer Part 0 - Team and Evidence Index

- Team: พวกพี่ชอบบิด
- Team number: TH-039; section: 1 (confirmed by the student)
- Topic: Theme 2 - Inventory and Borrowing System (BorrowBox)
- Natsumi Takagi - `67070505202` - [`MiMikoChAn913`](https://github.com/MiMikoChAn913)
- Ploychanok Imsuwan / พลอยชนก อิ่มสุวรรณ - `67070505205` - [`ploychanokimsu-lgtm`](https://github.com/ploychanokimsu-lgtm)
- Public repository: <https://github.com/MiMikoChAn913/inventory-borrowing-system>
- Submitted full commit: `d54664d847e7ccd5b1419d1e86870c6bf6c09a0d`
- Public service: <https://inventory-borrowing-4bhkmkbela-as.a.run.app>
- Running commit/revision: `d54664d847e7ccd5b1419d1e86870c6bf6c09a0d` / `inventory-borrowing-00006-t9c`

### Contributions

| Member | Verified Lab 5 contribution | Evidence |
|---|---|---|
| Natsumi Takagi | Created the labelled release Issue, implemented the visible release badge, opened the feature and release PRs, and supervised the deployment. | [Issue #13](https://github.com/MiMikoChAn913/inventory-borrowing-system/issues/13), [PR #14](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/14), [PR #15](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/15) |
| Ploychanok Imsuwan | Configured the GCP deployment/WIF path and performed specific teammate reviews of both release PR stages. | [PR #14 review](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/14), [PR #15 review](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/15), [deploy run](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/44794423519) |

| Rubric part | Artifact/direct link | Check/requirement and version | Verification result |
|---|---|---|---|
| 1 | [PR #14](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/14) + [passing CI](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/43619663615) + [PR/review rule](../../evidence/lab-05/c01-main-protection-pr-review.png) + [required-check rule](../../evidence/lab-05/c01-main-protection-required-check.png) | C-01 / `656db835d9295966fa52e45906474b4ba08ff692` | `main` requires a PR, one approval, strict/up-to-date `test-and-docker`, resolved conversations and no bypass; CI passed on the reviewed PR. |
| 1 | [temporary failing PR #12](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/12) + [failed required job](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/43618860017/job/132519782745) + [blocked-merge screenshot](../../evidence/lab-05/c02-merge-gate-blocked.png) | C-02 / `55c309bed4930ebe42f5264b1acb3082cdc048d8` | Required `test-and-docker` check failed, GitHub disabled the merge control, and the evidence-only PR was closed without merging. |
| 2 | [`Dockerfile`](https://github.com/MiMikoChAn913/inventory-borrowing-system/blob/d54664d847e7ccd5b1419d1e86870c6bf6c09a0d/Dockerfile), [`.dockerignore`](https://github.com/MiMikoChAn913/inventory-borrowing-system/blob/d54664d847e7ccd5b1419d1e86870c6bf6c09a0d/.dockerignore), [`.env.example`](https://github.com/MiMikoChAn913/inventory-borrowing-system/blob/d54664d847e7ccd5b1419d1e86870c6bf6c09a0d/.env.example), [CI build](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/44794423519/job/136490117891) | C-03 / `d54664d847e7ccd5b1419d1e86870c6bf6c09a0d` | Clean GitHub checkout installed dependencies, ran tests/build and built the production image successfully. |
| 3 | [public service](https://inventory-borrowing-4bhkmkbela-as.a.run.app) + [borrower request](../../evidence/lab-05/c04-borrower-request-pending.png) + [custodian approval](../../evidence/lab-05/c04-custodian-approved.png) + [after first replacement](../../evidence/lab-05/c05-after-redeploy-persisted.png) + [after second replacement](../../evidence/lab-05/c05-after-second-redeploy-persisted.png) + [latest run 45003403668](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/45003403668) | C-04/C-05 / `d54664d847e7ccd5b1419d1e86870c6bf6c09a0d` | Borrower created `LAB5-PERSIST-20261121`; Custodian approved it and Arduino stock changed from 10 to 9. The same approved record and stock survived two same-image Cloud Run replacements, first to `inventory-borrowing-00005-wlk` and then `inventory-borrowing-00006-t9c`; both public smoke tests passed. |
| 4 | [Issue #13](https://github.com/MiMikoChAn913/inventory-borrowing-system/issues/13) -> [PR #14](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/14) -> [PR #15](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/15) -> [deploy run](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/44794423519) | C-06 / `d54664d847e7ccd5b1419d1e86870c6bf6c09a0d` | Specific teammate reviews and CI passed; automatic push-to-main deployment produced revision `inventory-borrowing-00004-smh` and smoke test passed. |

## Answer Part 1 - CI and Quality Gate

- CI workflow: [`.github/workflows/ci-docker.yml`](https://github.com/MiMikoChAn913/inventory-borrowing-system/blob/d54664d847e7ccd5b1419d1e86870c6bf6c09a0d/.github/workflows/ci-docker.yml)
- Passing PR and meaningful test summary: [PR #14](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/14), [CI run 43619663615](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/43619663615). The job ran the automated tests and production build, checked deployment scripts and built the production Docker image.
- Main required-check setting: [PR/review settings](../../evidence/lab-05/c01-main-protection-pr-review.png), [strict required check and no-bypass settings](../../evidence/lab-05/c01-main-protection-required-check.png), and [force-push/deletion settings](../../evidence/lab-05/c01-main-protection-admin-rules.png) show that `main` requires strict/up-to-date `test-and-docker`, one approving review, stale-review dismissal, last-push approval and conversation resolution, with administrator enforcement.
- Normal temporary failing PR: [PR #12](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/12), [failed job](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/43618860017/job/132519782745), [blocked-merge screenshot](../../evidence/lab-05/c02-merge-gate-blocked.png). The required check failed, the merge control was disabled, and the PR was then closed without merging.

## Answer Part 2 - Docker and Reproducible Configuration

- Dockerfile and `.dockerignore`: [`Dockerfile`](https://github.com/MiMikoChAn913/inventory-borrowing-system/blob/d54664d847e7ccd5b1419d1e86870c6bf6c09a0d/Dockerfile), [`.dockerignore`](https://github.com/MiMikoChAn913/inventory-borrowing-system/blob/d54664d847e7ccd5b1419d1e86870c6bf6c09a0d/.dockerignore)
- Clean-checkout build output: [test-and-docker job](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/44794423519/job/136490117891). Commands are recorded in [`deployment.md`](deployment.md).
- Environment configuration: [`.env.example`](https://github.com/MiMikoChAn913/inventory-borrowing-system/blob/d54664d847e7ccd5b1419d1e86870c6bf6c09a0d/.env.example) and the environment-variable table in [`deployment.md`](deployment.md). No real secret value belongs in either file.

## Answer Part 3 - GCP Deployment and Persistence

- Public URL: <https://inventory-borrowing-4bhkmkbela-as.a.run.app>. The [Borrower screenshot](../../evidence/lab-05/c04-borrower-request-pending.png) records request `LAB5-PERSIST-20261121` in `PENDING`; the [Custodian screenshot](../../evidence/lab-05/c04-custodian-approved.png) records the same request as approved and Arduino stock at 9/10. The [negative-login screenshot](../../evidence/lab-05/c04-invalid-login-rejected.png) records an authentication rejection without exposing a password.
- GCP deployment: project `inventory-borrow-cpe334`, Cloud Run service `inventory-borrowing`, Cloud SQL instance `inventory-pg`, migration job `inventory-migrate`, current smoke-tested revision `inventory-borrowing-00006-t9c`, image digest `sha256:38bb2834f337ba2b174395709fa89f4fa1a77b6c67af927f67250f86986c4db2`.
- Persistence: [run 44930813963](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/44930813963) redeployed the same immutable image into a fresh Cloud Run revision and passed WIF authentication, Cloud Run update and smoke test. The [post-redeploy screenshot](../../evidence/lab-05/c05-after-redeploy-persisted.png) shows the same approved request, purpose, quantity and 9/10 stock after the new revision began serving traffic.
- Additional redeploy: [run 45003403668](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/45003403668) deployed the same digest to revision `inventory-borrowing-00006-t9c` and passed login, authenticated inventory, health, readiness/database and HTML checks. A fresh Custodian login on 22 November 2026 retrieved the same approved `LAB5-PERSIST-20261121` request, quantity 1, timestamp and 9/10 stock; [final persistence capture](../../evidence/lab-05/c05-after-second-redeploy-persisted.png). The UI displays the unique purpose label, not the internal request ID. Application replacement was exercised through fresh Cloud Run revisions; no independent restart-only command was run.

## Answer Part 4 - Repeatable Release Pipeline

- Labelled [Issue #13](https://github.com/MiMikoChAn913/inventory-borrowing-system/issues/13) -> feature [PR #14 into `staging`](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/14) -> release [PR #15 into `main`](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/15).
- Ploychanok's specific reviews on PR #14 and PR #15 verify the visible badge, target branches and passing check; both reviews approved the exact commits before merge.
- CI and automatic deployment: [release CI](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/43728682895) and [push-to-main deploy run 44794423519](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/44794423519).
- Original release revision: `inventory-borrowing-00004-smh` served image tagged with release SHA `d54664d847e7ccd5b1419d1e86870c6bf6c09a0d`. Subsequent same-image redeploys created `inventory-borrowing-00005-wlk` and current revision `inventory-borrowing-00006-t9c`; both deployment runs and smoke tests passed.
- Release procedure: [`deployment.md`](deployment.md).
- Project board (R-09): [BorrowBox - Team TH-039 Delivery Board](https://github.com/users/MiMikoChAn913/projects/4), [board capture](../../evidence/lab-05/c06-team-project-board.png), [repository association and creation-date note](../../evidence/lab-05/c06-repository-project-linked.png). Created 22 November 2026; six existing lab5-labelled items were imported, with five closed/merged cards Done and PR #19 In Progress. Earlier release work predates the board, so this does not prove board usage during those releases. The board is currently Private; the PDF embeds a capture for readers without project access.

## PDF artifact

- Section 1 was confirmed by the student on 22 November 2026.
- Generate the report with `python scripts/generate_lab5_pdf.py`; output: `output/pdf/lab5_sec1_พวกพี่ชอบบิด.pdf`.
- The report includes all three persistence checkpoints and a dated project-board capture. It explicitly records that the board was created after the earlier releases and remains Private; these facts must not be removed or presented as earlier board usage.

## Supporting local pre-deployment verification

- Verified on 13 November 2026: borrower submitted a request, custodian approved it, and borrower returned the item.
- The application container was restarted; the health endpoint returned HTTP 200 and the request remained `RETURNED` in PostgreSQL.
- [Borrower returned-item screenshot](../../evidence/local/borrower-returned.png)
- This local check is supporting development evidence; the public GCP C-04/C-05 evidence is recorded above.
