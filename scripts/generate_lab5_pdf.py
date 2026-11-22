"""Build the Lab 5 evidence report from verified, local screenshots.

Run with the bundled Python runtime. Crops are only for legibility; source
screenshots under docs/evidence/lab-05 remain unchanged.
"""
from io import BytesIO
from pathlib import Path

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer, PageBreak,
    Image, KeepTogether,
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output/pdf/lab5_sec1_พวกพี่ชอบบิด.pdf"
EVIDENCE = ROOT / "docs/evidence/lab-05"
REPO = "https://github.com/MiMikoChAn913/inventory-borrowing-system"
SHA = "d54664d847e7ccd5b1419d1e86870c6bf6c09a0d"
DIGEST = "sha256:38bb2834f337ba2b174395709fa89f4fa1a77b6c67af927f67250f86986c4db2"
URL = "https://inventory-borrowing-4bhkmkbela-as.a.run.app"
WIDTH = 178 * mm
INK = colors.HexColor("#17324d")
GREEN = colors.HexColor("#0a654d")
MUTED = colors.HexColor("#556575")
GRID = colors.HexColor("#ccd8df")

pdfmetrics.registerFont(TTFont("Tahoma", r"C:\Windows\Fonts\tahoma.ttf"))
pdfmetrics.registerFont(TTFont("Tahoma-Bold", r"C:\Windows\Fonts\tahomabd.ttf"))
pdfmetrics.registerFontFamily("Tahoma", normal="Tahoma", bold="Tahoma-Bold")
BODY = ParagraphStyle("body", fontName="Tahoma", fontSize=9, leading=13,
                      textColor=INK, spaceAfter=6)
H1 = ParagraphStyle("h1", parent=BODY, fontName="Tahoma-Bold", fontSize=14,
                    leading=19, spaceAfter=10)
H2 = ParagraphStyle("h2", parent=BODY, fontName="Tahoma-Bold", fontSize=10.5,
                    leading=15, spaceBefore=7, spaceAfter=5, textColor=GREEN)
SMALL = ParagraphStyle("small", parent=BODY, fontSize=7.6, leading=10.4,
                       textColor=MUTED, spaceAfter=7)
CELL = ParagraphStyle("cell", parent=BODY, fontSize=8, leading=11, spaceAfter=0)
HEAD = ParagraphStyle("head", parent=CELL, fontName="Tahoma-Bold",
                      textColor=colors.white)
CODE = ParagraphStyle("code", parent=BODY, fontName="Courier", fontSize=7.5,
                      leading=11)


def p(text, style=BODY):
    return Paragraph(text, style)


def link(label, path):
    href = path if path.startswith("http") else REPO + path
    return f'<link href="{href}" color="#0a654d"><u>{label}</u></link>'


def table(rows, widths):
    data = [[p(str(c), HEAD if i == 0 else CELL) for c in row]
            for i, row in enumerate(rows)]
    result = Table(data, colWidths=[w * mm for w in widths], repeatRows=1,
                   hAlign="LEFT")
    result.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), INK),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1),
         [colors.white, colors.HexColor("#f3f7fa")]),
        ("GRID", (0, 0), (-1, -1), .45, GRID),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return result


def note(text):
    t = Table([[p(text, CELL)]], colWidths=[WIDTH], hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#fff3e7")),
        ("BOX", (0, 0), (-1, -1), .6, colors.HexColor("#c57b31")),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return t


def crop(filename, bounds, width=WIDTH):
    path = filename if isinstance(filename, Path) else EVIDENCE / filename
    with PILImage.open(path) as source:
        region = source.crop(bounds)
        data = BytesIO()
        region.save(data, format="PNG")
        iw, ih = region.size
    data.seek(0)
    result = Image(data, width=width, height=width * ih / iw)
    result.hAlign = "LEFT"
    return result


def app_figure(filename, bounds, caption):
    return KeepTogether([
        crop(filename, (125, 43, 790, 82)),
        Spacer(1, 3),
        crop(filename, bounds),
        Spacer(1, 4),
        p(caption + " Cropped URL and record regions from the same original capture.", SMALL),
    ])


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(GRID)
    canvas.line(16 * mm, 12 * mm, 194 * mm, 12 * mm)
    canvas.setFont("Tahoma", 7)
    canvas.setFillColor(MUTED)
    canvas.drawString(16 * mm, 8 * mm, "CPE 334 Lab 5 | Sec 1 | TH-039 พวกพี่ชอบบิด")
    canvas.drawRightString(194 * mm, 8 * mm, f"22 Nov 2026 | {doc.page}")
    canvas.restoreState()


story = [
    p("CPE 334 - Lab 5", ParagraphStyle("title", parent=H1, fontSize=22, leading=28)),
    p("Cloud Deployment and CI/CD Pipeline on GCP", H2),
    p("Answer Part 0: Team and Evidence Index", H1),
    table([
        ["Item", "Verified value"],
        ["Team / section", "TH-039 พวกพี่ชอบบิด / Section 1"],
        ["Topic", "Theme 2 - Inventory and Borrowing System (BorrowBox)"],
        ["Members", "Natsumi Takagi - 67070505202 - MiMikoChAn913<br/>"
         "Ploychanok Imsuwan / พลอยชนก อิ่มสุวรรณ - 67070505205 - ploychanokimsu-lgtm"],
        ["Public repository", link("MiMikoChAn913/inventory-borrowing-system", "")],
        ["Submitted / served commit", SHA],
        ["Public URL", link(URL, URL)],
        ["Current revision", "inventory-borrowing-00006-t9c (same release image)"],
    ], [39, 139]),
    p("Evidence index", H2),
    table([
        ["Part / check", "Direct evidence", "Verification result"],
        ["1 / C-01, C-02", link("PR #14 + passing CI", "/pull/14") + "<br/>" +
         link("PR #12 + failed check", "/pull/12"),
         "12 tests passed on release; required test-and-docker and review gate recorded. Failing evidence PR closed without merging."],
        ["2 / C-03", link("Dockerfile", f"/blob/{SHA}/Dockerfile") + " / " +
         link(".env.example", f"/blob/{SHA}/.env.example"),
         "Clean CI build, PostgreSQL API tests and production image build passed; local running-container evidence retained."],
        ["3 / C-04, C-05", link("Live app", URL) + " / " +
         link("first replacement", "/actions/runs/44930813963") + " / " +
         link("second replacement", "/actions/runs/45003403668"),
         "Borrower request, Custodian approval and login rejection captured. Same record survived first replacement; final capture after second replacement is outstanding."],
        ["4 / C-06", link("Issue #13", "/issues/13") + " -> " +
         link("PR #14", "/pull/14") + " -> " + link("PR #15", "/pull/15") + " -> " +
         link("automatic deploy", "/actions/runs/44794423519"),
         "Reviewed visible release badge reached main and deployed automatically. SHA and digest identify the image."],
    ], [25, 65, 88]),
    p("Contributions", H2),
    table([
        ["Member", "Traceable Lab 5 contribution"],
        ["Natsumi Takagi", link("Issue #13", "/issues/13") + ": visible release badge; feature " +
         link("PR #14", "/pull/14") + ", release " + link("PR #15", "/pull/15") +
         ", supervised deployment and evidence preparation."],
        ["Ploychanok Imsuwan", "GCP/WIF setup; specific teammate reviews on " +
         link("PR #14", "/pull/14") + " and " + link("PR #15", "/pull/15") + "."],
    ], [39, 139]),
    PageBreak(),
    p("Answer Part 1: CI and Quality Gate", H1),
    p(link("CI workflow", f"/blob/{SHA}/.github/workflows/ci-docker.yml") +
      " runs on relevant PRs into staging and main. " +
      link("PR #14", "/pull/14") + " passed " +
      link("CI run 43619663615", "/actions/runs/43619663615") + "."),
    p("The " + link("released-commit test job", "/actions/runs/44794423519/job/136490117891") +
      " reports 6 unit tests and 6 API/database tests, all passed (0 failures). Checks cover quantity validation, stock rejection, review/return state rules, login/session handling, role restrictions, and the request-approve-return journey. Production build and Docker build also passed."),
    p("C-01 / R-05, R-06 - required check and review", H2),
    crop("c01-main-protection-pr-review.png", (288, 174, 1150, 280)),
    Spacer(1, 3),
    crop("c01-main-protection-pr-review.png", (300, 465, 1137, 608)),
    p("Figure 1. C-01 (R-05/R-06): owner-view main protection, requiring a PR and one approval. Cropped regions from the settings capture; passing example PR #14, commit 656db835d929.", SMALL),
    crop("c01-main-protection-required-check.png", (10, 0, 872, 244)),
    p("Figure 2. C-01/R-06: test-and-docker is required and branches must be up to date. Additional saved settings enforce administrators and disable force pushes/deletions.", SMALL),
    p("C-02 / R-06 - intentionally failing temporary PR", H2),
    crop("c02-merge-gate-blocked.png", (18, 0, 659, 194)),
    p("Figure 3. C-02 (R-06): " + link("PR #12", "/pull/12") +
      ", commit 55c309bed493, shows a failing required check and disabled Merge pull request control. The " +
      link("failed job", "/actions/runs/43618860017/job/132519782745") +
      " is retained; the evidence-only PR was closed without merging.", SMALL),
    PageBreak(),
    p("Answer Part 2: Docker and Reproducible Configuration", H1),
    p(link("Dockerfile", f"/blob/{SHA}/Dockerfile") + " uses build/runtime stages and runs as a non-root app user. " +
      link(".dockerignore", f"/blob/{SHA}/.dockerignore") + " limits the build context; " +
      link("docker-compose.yml", f"/blob/{SHA}/docker-compose.yml") + " supplies the local app and PostgreSQL."),
    p("C-03 / R-01, R-02 - build and runtime", H2),
    p("The " + link("release CI job", "/actions/runs/44794423519/job/136490117891") +
      " starts with a clean checkout, generates Prisma, applies migrations, passes the PostgreSQL-backed API tests and builds the production image. The commands below reproduce the local workflow after filling the placeholder-only .env.example values."),
    p("pnpm install --frozen-lockfile<br/>pnpm db:generate<br/>pnpm db:deploy<br/>"
      "pnpm db:seed<br/>pnpm test<br/>pnpm build<br/>"
      "docker build -t inventory-borrowing:local .<br/>docker compose up --build", CODE),
    crop(ROOT / "docs/evidence/local/borrower-returned.png", (70, 42, 604, 82)),
    Spacer(1, 3),
    crop(ROOT / "docs/evidence/local/borrower-returned.png", (27, 551, 635, 663)),
    p("Figure 4. C-03 supporting runtime capture, 13 Nov 2026: localhost:3000 displays a returned Integration projector request backed by the local PostgreSQL deployment. This is local evidence, separate from the public GCP journey in Part 3.", SMALL),
    p("Environment contract and secret sources", H2),
    table([
        ["Variable(s)", "Purpose / source", "Secret"],
        ["DATABASE_URL", "Prisma PostgreSQL connection; Secret Manager inventory-database-url in GCP", "Yes"],
        ["PORT / NODE_ENV", "Listen port / production mode; Cloud Run environment", "No"],
        ["COOKIE_SECURE / SESSION_TTL_HOURS", "HTTPS cookie flag / session lifetime; runtime environment", "No"],
        ["SEED_BORROWER_EMAIL / SEED_CUSTODIAN_EMAIL", "Demo role identifiers; migration-job environment", "No"],
        ["SEED_BORROWER_PASSWORD / SEED_CUSTODIAN_PASSWORD", "Seeded-account credentials; Secret Manager", "Yes"],
        ["CLIENT_ORIGIN", "Local .env.example field; current server config does not read it", "No"],
    ], [76, 85, 17]),
    p("GitHub uses GCP_PROJECT_ID, GCP_REGION, WIF_PROVIDER, WIF_SERVICE_ACCOUNT and SMOKE_EMAIL as variables, with SMOKE_PASSWORD as an environment secret. WIF supplies short-lived credentials without a service-account JSON key. No actual password is included in this report.", SMALL),
    PageBreak(),
    p("Answer Part 3: GCP Deployment and Persistence", H1),
    p("C-04 / R-03 - public domain workflow", H2),
    p("Open " + link(URL, URL) + ". The Borrower created an Arduino kit request; the Custodian's approved-state capture appears on the next page. " +
      link("Automatic deployment run 44794423519", "/actions/runs/44794423519") +
      " passed image build/push, migration, Cloud Run update and authenticated public smoke tests."),
    table([
        ["GCP component", "Verified resource / result"],
        ["Project / region", "inventory-borrow-cpe334 / asia-southeast1"],
        ["Service / database", "Cloud Run inventory-borrowing / Cloud SQL inventory-pg, PostgreSQL 16, inventory_db"],
        ["Migration job", "inventory-migrate; original release migration succeeded"],
        ["Current revision", "inventory-borrowing-00006-t9c; same release SHA and digest"],
        ["Public smoke checks", "Login, authenticated inventory, health, readiness/database connectivity and HTML passed"],
    ], [43, 135]),
    Spacer(1, 9),
    app_figure("c04-borrower-request-pending.png", (24, 648, 601, 757),
               "Figure 5. C-04 (R-03): successful Borrower request, status pending, quantity 1, purpose LAB5-PERSIST-20261121. Public URL shown above; release d54664d847e7."),
    p("Authentication rejection", H2),
    crop("c04-invalid-login-rejected.png", (125, 43, 790, 82)),
    Spacer(1, 4),
    crop("c04-invalid-login-rejected.png", (232, 141, 754, 203)),
    p("Figure 6. C-04 (R-03): the public UI rejects an invalid login with 'Email or password is incorrect.' The crop retains the rejection and URL and excludes the password field. This is authentication/access-restriction evidence, not a stock-rule test.", SMALL),
    PageBreak(),
    p("Answer Part 3: GCP Deployment and Persistence", H1),
    p("C-05 / R-04 - record before and after replacement", H2),
    p("The unique purpose label LAB5-PERSIST-20261121 identifies the same UI record; the UI does not expose its internal request ID. Both captures show Arduino kit, quantity 1, Demo Borrower, the same request timestamp and approved status. Inventory remained 9/10 after approval."),
    app_figure("c04-custodian-approved.png", (24, 596, 590, 704),
               "Figure 7. C-04/C-05 (R-03/R-04): Custodian approved the request before application replacement, on release d54664d847e7, revision inventory-borrowing-00004-smh."),
    app_figure("c05-after-redeploy-persisted.png", (24, 596, 590, 704),
               "Figure 8. C-05 (R-04): same approved record after run 44930813963 created revision inventory-borrowing-00005-wlk. The browser was refreshed after deployment; release image was unchanged."),
    p("Replacement operations and current evidence boundary", H2),
    table([
        ["Checkpoint", "Result"],
        [link("Run 44930813963", "/actions/runs/44930813963"),
         "Same-image redeploy from 00004-smh to fresh revision 00005-wlk; smoke tests passed and Figure 8 confirms record persistence."],
        [link("Run 45003403668", "/actions/runs/45003403668"),
         "Second same-image redeploy created 00006-t9c; WIF, deployment and smoke tests passed on 22 Nov 2026. Record-specific UI capture is outstanding."],
    ], [46, 132]),
    Spacer(1, 7),
    note("<b>Outstanding C-05 capture:</b> refresh the public app on current revision 00006-t9c and capture the same approved request. Browser control stopped before this capture because it could not verify the current URL. The smoke test does not query this individual request. These runs exercise replacement with fresh Cloud Run revisions; no separate restart-only command was run."),
    PageBreak(),
    p("Answer Part 4: Repeatable Release Pipeline", H1),
    p("C-06 / R-07 to R-10 - reviewed visible release", H2),
    table([
        ["Stage", "Evidence and result"],
        [link("Issue #13", "/issues/13"), "Label lab5; visible release badge, implemented on feat/release-footer."],
        [link("PR #14 into staging", "/pull/14"), "Teammate's specific review and passing test-and-docker; merged."],
        [link("PR #15 staging to main", "/pull/15"), "Teammate's specific release review and required CI; merged."],
        [link("Automatic run 44794423519", "/actions/runs/44794423519"), "Triggered by push to main; WIF, image build/push, migration, Cloud Run and smoke tests passed."],
        ["Original release / current", "Original inventory-borrowing-00004-smh; current inventory-borrowing-00006-t9c redeploys the same accepted image."],
    ], [54, 124]),
    p("Specific teammate reviews", H2),
    p("Ploychanok's PR #14 review checked the visible badge against Issue #13, UI consistency, the staging target and passing CI. PR #15 review checked promotion of the accepted staging change, production build and readiness to release to main. The PR author did not approve their own PRs."),
    p("Image identity", H2),
    table([
        ["Field", "Released value"],
        ["Full commit / image tag", SHA],
        ["Artifact Registry image", "asia-southeast1-docker.pkg.dev/inventory-borrow-cpe334/inventory/inventory-borrowing"],
        ["Immutable digest", DIGEST],
        ["Latest deployment", link("run 45003403668", "/actions/runs/45003403668") + " / inventory-borrowing-00006-t9c"],
    ], [37, 141]),
    p("Repeatable release procedure", H2),
    p("1. Create a labelled Issue and branch from staging.<br/>"
      "2. Open the feature/fix PR into staging; teammate gives a specific review and CI passes, then merge.<br/>"
      "3. Open the release PR from staging into main; obtain review and the required passing check, then merge.<br/>"
      "4. deploy.yml builds the full-SHA image, resolves its digest, runs migrations, updates Cloud Run and smoke-tests the public URL.<br/>"
      "5. Record SHA, digest, revision and run link in deployment.md. For a same-image redeploy/rollback, dispatch the workflow with an existing full image SHA; this path skips build and migration."),
    p("Documentation and remaining verification", H2),
    p(link("PR #16", "/pull/16") + " containing the earlier deployment record was merged into staging. Current local evidence-index.md and deployment.md include the two persistence runs and the outstanding final UI capture. A project-board link (R-09) was not verified: the available GitHub token lacks read:project scope; no claim of verified board usage is made here.", SMALL),
    p("Snapshot prepared 22 November 2026 (Asia/Bangkok). Evidence is limited to the linked runs and saved captures; no final record state after the second redeploy is asserted.", SMALL),
]

OUT.parent.mkdir(parents=True, exist_ok=True)
doc = SimpleDocTemplate(str(OUT), pagesize=A4, leftMargin=16*mm,
                        rightMargin=16*mm, topMargin=16*mm,
                        bottomMargin=18*mm, title="CPE334 Lab5 Sec1 TH-039 - Evidence Report",
                        author="Natsumi Takagi and Ploychanok Imsuwan")
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUT)
