# Lab 5 PDF Evidence Index

This file is the source checklist for the submitted PDF. It records only evidence that
has been verified. Items marked **Pending screenshot** must be captured before the PDF
is submitted. The final PDF must use headings Answer Part 0 through Answer Part 4.

## Answer Part 0 - Team and Evidence Index

- Team: พวกพี่ชอบบิด
- Topic: Theme 2 - Inventory and Borrowing System (BorrowBox)
- Natsumi Takagi - `67070505202` - [`MiMikoChAn913`](https://github.com/MiMikoChAn913)
- Ploychanok Imsuwan / พลอยชนก อิ่มสุวรรณ - `67070505205` - [`ploychanokimsu-lgtm`](https://github.com/ploychanokimsu-lgtm)
- Public repository: <https://github.com/MiMikoChAn913/inventory-borrowing-system>
- Submitted full commit: `d54664d847e7ccd5b1419d1e86870c6bf6c09a0d`
- Public service: <https://inventory-borrowing-4bhkmkbela-as.a.run.app>
- Running commit/revision: `d54664d847e7ccd5b1419d1e86870c6bf6c09a0d` / `inventory-borrowing-00004-smh`

### Contributions

| Member | Verified Lab 5 contribution | Evidence |
|---|---|---|
| Natsumi Takagi | Created the labelled release Issue, implemented the visible release badge, opened the feature and release PRs, and supervised the deployment. | [Issue #13](https://github.com/MiMikoChAn913/inventory-borrowing-system/issues/13), [PR #14](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/14), [PR #15](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/15) |
| Ploychanok Imsuwan | Configured the GCP deployment/WIF path and performed specific teammate reviews of both release PR stages. | [PR #14 review](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/14), [PR #15 review](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/15), [deploy run](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/44794423519) |

| Rubric part | Artifact/direct link | Check/requirement and version | Verification result |
|---|---|---|---|
| 1 | [PR #14](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/14) + [passing CI](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/43619663615) | C-01 / `656db835d9295966fa52e45906474b4ba08ff692` | Build, tests, deployment-script checks and production Docker build passed. |
| 1 | [temporary failing PR #12](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/12) + [failed required job](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/43618860017/job/132519782745) | C-02 / `55c309bed4930ebe42f5264b1acb3082cdc048d8` | Required `test-and-docker` check failed. **Pending screenshot:** red check and blocked merge control. |
| 2 | [`Dockerfile`](https://github.com/MiMikoChAn913/inventory-borrowing-system/blob/d54664d847e7ccd5b1419d1e86870c6bf6c09a0d/Dockerfile), [`.dockerignore`](https://github.com/MiMikoChAn913/inventory-borrowing-system/blob/d54664d847e7ccd5b1419d1e86870c6bf6c09a0d/.dockerignore), [`.env.example`](https://github.com/MiMikoChAn913/inventory-borrowing-system/blob/d54664d847e7ccd5b1419d1e86870c6bf6c09a0d/.env.example), [CI build](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/44794423519/job/136490117891) | C-03 / `d54664d847e7ccd5b1419d1e86870c6bf6c09a0d` | Clean GitHub checkout installed dependencies, ran tests/build and built the production image successfully. |
| 3 | [public service](https://inventory-borrowing-4bhkmkbela-as.a.run.app) + [deployment/smoke run](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/44794423519) | C-04/C-05 / `d54664d847e7ccd5b1419d1e86870c6bf6c09a0d` | Automated login, authenticated inventory, UI HTML, health and database readiness passed. **Pending screenshots:** main UI action, rule/access rejection and the same record before/after restart and redeploy. |
| 4 | [Issue #13](https://github.com/MiMikoChAn913/inventory-borrowing-system/issues/13) -> [PR #14](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/14) -> [PR #15](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/15) -> [deploy run](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/44794423519) | C-06 / `d54664d847e7ccd5b1419d1e86870c6bf6c09a0d` | Specific teammate reviews and CI passed; automatic push-to-main deployment produced revision `inventory-borrowing-00004-smh` and smoke test passed. |

## Answer Part 1 - CI and Quality Gate

- CI workflow: [`.github/workflows/ci-docker.yml`](https://github.com/MiMikoChAn913/inventory-borrowing-system/blob/d54664d847e7ccd5b1419d1e86870c6bf6c09a0d/.github/workflows/ci-docker.yml)
- Passing PR and meaningful test summary: [PR #14](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/14), [CI run 43619663615](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/43619663615). The job ran the automated tests and production build, checked deployment scripts and built the production Docker image.
- Main required-check setting: GitHub reports strict/up-to-date `test-and-docker`, one approving review, stale-review dismissal, last-push approval and conversation resolution, with administrator enforcement. **Pending screenshot:** repository Settings showing the protected `main` rule.
- Normal temporary failing PR: [PR #12](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/12), [failed job](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/43618860017/job/132519782745). **Pending screenshot:** the failed required check and blocked merge control; close the PR without merging only after the screenshot is saved.

## Answer Part 2 - Docker and Reproducible Configuration

- Dockerfile and `.dockerignore`: [`Dockerfile`](https://github.com/MiMikoChAn913/inventory-borrowing-system/blob/d54664d847e7ccd5b1419d1e86870c6bf6c09a0d/Dockerfile), [`.dockerignore`](https://github.com/MiMikoChAn913/inventory-borrowing-system/blob/d54664d847e7ccd5b1419d1e86870c6bf6c09a0d/.dockerignore)
- Clean-checkout build output: [test-and-docker job](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/44794423519/job/136490117891). Commands are recorded in [`deployment.md`](deployment.md).
- Environment configuration: [`.env.example`](https://github.com/MiMikoChAn913/inventory-borrowing-system/blob/d54664d847e7ccd5b1419d1e86870c6bf6c09a0d/.env.example) and the environment-variable table in [`deployment.md`](deployment.md). No real secret value belongs in either file.

## Answer Part 3 - GCP Deployment and Persistence

- Public URL: <https://inventory-borrowing-4bhkmkbela-as.a.run.app>. [Run 44794423519](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/44794423519) verified login, authenticated inventory, UI HTML, health and database readiness. **Pending screenshots:** borrower request, custodian approval and one rule/access rejection with the URL visible.
- GCP deployment: project `inventory-borrow-cpe334`, Cloud Run service `inventory-borrowing`, Cloud SQL instance `inventory-pg`, migration job `inventory-migrate`, revision `inventory-borrowing-00004-smh`, image digest `sha256:38bb2834f337ba2b174395709fa89f4fa1a77b6c67af927f67250f86986c4db2`.
- Persistence: **Pending screenshots:** record ID/state before restart, the same record after restart and the same record after a redeploy. Do not expose a password, connection string or key in any screenshot.

## Answer Part 4 - Repeatable Release Pipeline

- Labelled [Issue #13](https://github.com/MiMikoChAn913/inventory-borrowing-system/issues/13) -> feature [PR #14 into `staging`](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/14) -> release [PR #15 into `main`](https://github.com/MiMikoChAn913/inventory-borrowing-system/pull/15).
- Ploychanok's specific reviews on PR #14 and PR #15 verify the visible badge, target branches and passing check; both reviews approved the exact commits before merge.
- CI and automatic deployment: [release CI](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/43728682895) and [push-to-main deploy run 44794423519](https://github.com/MiMikoChAn913/inventory-borrowing-system/actions/runs/44794423519).
- Running revision: `inventory-borrowing-00004-smh` serves image tagged with release SHA `d54664d847e7ccd5b1419d1e86870c6bf6c09a0d`; deployment and smoke test passed.
- Release procedure: [`deployment.md`](deployment.md).

## Supporting local pre-deployment verification

- Verified on 13 November 2026: borrower submitted a request, custodian approved it, and borrower returned the item.
- The application container was restarted; the health endpoint returned HTTP 200 and the request remained `RETURNED` in PostgreSQL.
- [Borrower returned-item screenshot](../../evidence/local/borrower-returned.png)
- This local check supports development only and does not replace the pending public GCP C-04/C-05 screenshots.
