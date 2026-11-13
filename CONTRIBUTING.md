# Contributing to BorrowBox

This repository belongs to CPE 334 team **พวกพี่ชอบบิด**.

## Team accounts

- `MiMikoChAn913`
- `ploychanokimsu-lgtm`

## Branch responsibilities

- `main` contains reviewed release candidates and is the deployment source.
- `staging` integrates completed Sprint work before a release.
- Short-lived branches use `feature/`, `fix/`, `test/` or `docs/` followed by the related Issue number and a short description.

## Change workflow

1. Create a real GitHub Issue with a goal and acceptance criteria.
2. Branch from `staging`, for example `feature/12-borrow-history`.
3. Implement the smallest change that satisfies the Issue and update tests or documentation.
4. Run the relevant local checks.
5. Open a PR into `staging` and link the Issue with `Closes #<number>`.
6. Wait for CI to pass and ask the other teammate for a specific review.
7. Address review feedback before merging.
8. Release through a reviewed PR from `staging` into `main`.

Do not invent Issues, reviews, test output or screenshots after the fact. Evidence must link to the real GitHub activity.

## Local verification

```bash
pnpm test:unit
pnpm test:integration
pnpm build
docker compose up --build
```

Integration tests require a migrated disposable PostgreSQL database. Never commit `.env`, passwords, database URLs, service-account keys or other secrets.

## Pull request checklist

- [ ] The PR links its Issue and states what changed.
- [ ] Acceptance criteria and affected requirements are identified.
- [ ] Tests or verification evidence are included.
- [ ] No secret or generated dependency directory is committed.
- [ ] CI passes.
- [ ] The other teammate leaves a specific review before merge.
