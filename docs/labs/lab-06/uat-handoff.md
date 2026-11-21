# Lab 6 Part A - Sprint 1 UAT Handoff

Product Team: พวกพี่ชอบบิด (Team 2) - Theme 2, Inventory and Borrowing System
UAT Team: ยอดนักบิด (sec131) - Pimchaya Suprateravanit (`pimchayasupr-hash`), Suphattra Kongsiriphat (`supa-gif173`); student IDs `<TO CONFIRM>`

This handoff lets the UAT Team execute every case without verbal explanation. All data is
synthetic. Credentials are sent privately through the course handoff and never appear here.

## 1. Release under test

| Field | Value |
|---|---|
| Repository | <https://github.com/MiMikoChAn913/inventory-borrowing-system> |
| Sprint 1 application commit | `d54664d847e7ccd5b1419d1e86870c6bf6c09a0d` (`main`) |
| Deployed Cloud Run revision | `inventory-borrowing-00004-smh` |
| URL | <https://inventory-borrowing-4bhkmkbela-as.a.run.app> |
| Contract | `docs/sprints/sprint-1/inventory-borrowing.md` (Sprint 1 Engineering Contract v1.0) |

The Product Team will message the UAT Team **before** any merge to `main`, because every merge
to `main` deploys a new revision. A documentation-only merge produces a new revision with
identical application code; the UAT Team should record whichever revision it actually used.

## 2. Accepted-for-test scope

In scope (Sprint 1, F-01..F-06): login/logout, inventory list with total/available quantities,
Borrower request, Custodian approve/reject (with reason), Borrower return, Custodian add item,
and backend role/ownership enforcement.

Out of scope (do not report as Sprint 1 defects; may be logged as enhancements): self-registration,
password recovery, item images, date reservations, due dates/overdue (Sprint 2), custodian return
confirmation (Sprint 2), search/reporting and audit export (Sprint 3), item deletion/editing.

## 3. Accounts (labels only)

| Label | Role | Display name | Notes |
|---|---|---|---|
| ACC-B1 | Borrower | Demo Borrower | Sent privately |
| ACC-C1 | Custodian | Demo Custodian | Sent privately |
| ACC-B2 | Borrower | Demo Borrower 2 | Needed only for UAT-06 (ownership); created as a one-off data setup, no code change. Sent privately |

## 4. Data setup, independence and cleanup

- The deployment uses one shared PostgreSQL database. Other people may change stock between
  steps, so **record the "available" value immediately before each action** and check the change,
  not an absolute number.
- Seeded items: Notebook computer (5), Projector (2), Arduino kit (10).
- Run cases in order UAT-01 → UAT-06. UAT-04 depends on records created in UAT-01 and UAT-02.
  The other cases are independent.
- Prefix every purpose text and new item name with `UAT-<your team>-` so records are identifiable.
- Cleanup: return every request you approved (UAT steps already do this). Created items cannot be
  deleted in Sprint 1 (out of scope); leave them, prefixed as above.

## 5. UI labels (the interface is in Thai)

| Thai label | Meaning |
|---|---|
| เข้าสู่ระบบ / ออกจากระบบ | Log in / Log out |
| ยืม (button on item card) | Borrow |
| จำนวน / วัตถุประสงค์ / ส่งคำขอ | Quantity / Purpose / Submit request |
| อนุมัติ / ปฏิเสธ | Approve / Reject |
| แจ้งคืนอุปกรณ์ | Report return |
| เพิ่มอุปกรณ์ | Add item |
| ↻ อัปเดตข้อมูล | Refresh |
| มีให้ยืม X จากทั้งหมด Y ชิ้น | X available of Y total |

## 6. Browser console snippets (for direct API checks)

Some cases check that the **server** rejects an action the UI hides. Open DevTools (F12) → Console
on the application tab while logged in, paste the snippet, and record the printed status and body.

```js
// S1: generic call. Usage: await call("POST", "/api/items", { name: "x", ... })
const call = async (method, path, body) => {
  const r = await fetch(path, { method, credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined });
  const text = await r.text(); console.log(r.status, text); return r.status;
};
// S2: list my visible requests with ids
(await (await fetch("/api/borrow-requests")).json()).requests
  .map(r => ({ id: r.id, item: r.item.name, qty: r.quantity, status: r.status, owner: r.borrower.displayName }));
```

## 7. UAT cases

### UAT-01 Normal borrowing journey

- **References:** FR-02..FR-06; AC-INV-01, AC-BR-01, AC-BR-04, AC-BR-05
- **Purpose:** verify the complete Borrower → Custodian → Borrower lifecycle and stock movement.
- **Roles:** ACC-B1, ACC-C1. **Preconditions:** Arduino kit available ≥ 1.
- **Inputs:** item Arduino kit, quantity 1, purpose `UAT-<team>-01 lab practice`.

| # | Action | Expected result |
|---|---|---|
| 1 | Log in as ACC-B1. | Dashboard greets "Demo Borrower"; item list shows each item's available/total. |
| 2 | Note Arduino kit available = **A**. Click ยืม on Arduino kit, enter the inputs, click ส่งคำขอ. | Success message; new request appears in "คำขอของฉัน" with status PENDING, quantity 1. Available is still **A** (stock is not taken at request time). |
| 3 | Log out; log in as ACC-C1. | Request list shows all requests, including the new one as PENDING with borrower "Demo Borrower". |
| 4 | Click อนุมัติ on the new request. | Status becomes APPROVED; Arduino kit available becomes **A − 1**. |
| 5 | Log out; log in as ACC-B1. | Request shows APPROVED; button แจ้งคืนอุปกรณ์ is visible. |
| 6 | Click แจ้งคืนอุปกรณ์. | Status becomes RETURNED; Arduino kit available returns to **A**; return button disappears. |

### UAT-02 Business rule: approval cannot exceed stock; rejection needs a reason

- **References:** BR-02, BR-03, BR-07; AC-BR-03, AC-BR-04
- **Purpose:** verify stock never goes negative and rejection records a reason.
- **Roles:** ACC-B1, ACC-C1. **Preconditions:** Projector available = 2 (if lower, wait/coordinate with the Product Team).
- **Inputs:** request R1 = Projector ×2, purpose `UAT-<team>-02a`; request R2 = Projector ×1, purpose `UAT-<team>-02b`; reason `UAT-<team> no stock left`.

| # | Action | Expected result |
|---|---|---|
| 1 | As ACC-B1, submit R1 then R2. | Both PENDING; Projector available still 2. |
| 2 | As ACC-C1, approve R1. | R1 APPROVED; Projector available 0. |
| 3 | Approve R2. | Error message shown (insufficient stock); R2 stays PENDING; Projector available stays **0** (never negative). |
| 4 | Click ปฏิเสธ on R2, leave the reason box empty, press OK. | Error message (reason required); R2 stays PENDING. |
| 5 | Click ปฏิเสธ on R2 again, enter the reason, press OK. | R2 REJECTED with the reason shown. No อนุมัติ/ปฏิเสธ buttons remain on R2. |
| 6 | Console S1: `await call("POST", "/api/borrow-requests/<R2 id>/approve")` (id from S2). | `409` CONFLICT; R2 still REJECTED after refresh. |
| 7 | Cleanup: as ACC-B1 return R1. | R1 RETURNED; Projector available back to 2. |

### UAT-03 Forbidden role and unauthenticated access

- **References:** BR-04, NFR-01; AC-AUTH-01, AC-AUTH-03, AC-INV-02
- **Purpose:** verify the server, not only the UI, blocks Borrower-only/Custodian-only actions.
- **Roles:** ACC-B1, ACC-C1. **Preconditions:** none.

| # | Action | Expected result |
|---|---|---|
| 1 | Log in as ACC-B1. | No "เพิ่มอุปกรณ์" form and no อนุมัติ/ปฏิเสธ buttons are shown. |
| 2 | Note the item count. Console: `await call("POST", "/api/items", { name: "UAT-<team>-forbidden", description: "should fail", totalQuantity: 3 })` | `403`; body has an error and no item data. After refresh, item count unchanged and no "UAT-<team>-forbidden" item exists. |
| 3 | Submit a request (Notebook computer ×1, purpose `UAT-<team>-03`); copy its id via S2. Console: `await call("POST", "/api/borrow-requests/<id>/approve")` | `403`; after refresh the request is still PENDING and Notebook available unchanged. |
| 4 | Log out; log in as ACC-C1. Console: `await call("POST", "/api/borrow-requests", { itemId: "<any item id>", quantity: 1, purpose: "custodian should fail" })` | `403`; no new request in the list. |
| 5 | Reject the `UAT-<team>-03` request with reason `UAT cleanup`. Log out. Console: `await call("GET", "/api/items")` and `await call("GET", "/api/auth/me")` | Request REJECTED. Both calls return `401` with no item or user data. |

### UAT-04 State, history and persistence

- **References:** BR-06, NFR-02; AC-BR-05, AC-AUTH-04, AC-PERSIST-01
- **Purpose:** verify completed states and history persist across sessions and cannot be replayed.
- **Roles:** ACC-B1. **Preconditions:** UAT-01 and UAT-02 completed.

| # | Action | Expected result |
|---|---|---|
| 1 | Close the browser; open a new private/incognito window; log in as ACC-B1. | UAT-01 request RETURNED; R1 RETURNED; R2 REJECTED with its reason text; quantities and purposes unchanged. |
| 2 | Note Arduino kit available = **A**. Console: `await call("POST", "/api/borrow-requests/<UAT-01 id>/return")` | `409` (already returned); after refresh Arduino kit available is still **A** (stock restored only once). |
| 3 | Click ออกจากระบบ. Console: `await call("GET", "/api/auth/me")` | `401`; the old session no longer works. |
| 4 | (Product Team, coordinated) Product Team restarts/redeploys the Cloud Run service and tells the UAT Team the new revision. UAT Team logs in again. | Same requests, states, reasons and stock values as step 1. Record the new revision. |

### UAT-05 Custodian adds inventory; invalid quantities rejected

- **References:** FR-07, BR-01; AC-INV-02, AC-BR-02
- **Purpose:** verify item creation and positive-whole-number validation.
- **Roles:** ACC-C1, ACC-B1.
- **Inputs:** item `UAT-<team>-Tripod`, description `Camera tripod`, quantity 3.

| # | Action | Expected result |
|---|---|---|
| 1 | As ACC-C1, fill the เพิ่มอุปกรณ์ form with the inputs and submit. | Item appears with 3 available of 3 total. |
| 2 | Console: `await call("POST", "/api/items", { name: "UAT-<team>-Zero", description: "zero", totalQuantity: 0 })` | `400`; no "UAT-<team>-Zero" item after refresh. |
| 3 | Log in as ACC-B1; the tripod is listed as 3/3. Get its id (`(await (await fetch("/api/items")).json())`). For each quantity `0`, `-1`, `1.5`, `"2"`: `await call("POST", "/api/borrow-requests", { itemId: "<tripod id>", quantity: <value>, purpose: "UAT-<team>-05 invalid" })` | Each returns `400`; no "UAT-<team>-05 invalid" request appears. |
| 4 | Request the tripod with quantity 4 (more than available 3) through the console. | `409`; no request created; tripod stays 3/3. |

### UAT-06 Borrower ownership (requires ACC-B2)

- **References:** BR-05; AC-BR-05, AC-BR-06
- **Purpose:** verify a Borrower cannot see or return another Borrower's request.
- **Roles:** ACC-B1, ACC-B2, ACC-C1.

| # | Action | Expected result |
|---|---|---|
| 1 | As ACC-B1, request Arduino kit ×1 (purpose `UAT-<team>-06`); as ACC-C1 approve it. Note its id and Arduino available **A**. | APPROVED; available **A**. |
| 2 | Log in as ACC-B2. View "คำขอของฉัน" and run S2. | The ACC-B1 request is not listed and its id/purpose do not appear. |
| 3 | Console: `await call("POST", "/api/borrow-requests/<ACC-B1 id>/return")` | `403`; Arduino available still **A**; request still APPROVED for ACC-B1. |
| 4 | Cleanup: ACC-B1 returns the request. | RETURNED; available **A + 1**. |

## 8. Recording results (for the UAT Team)

For every case record: case ID, tester name and team, date/time (ICT), revision shown above or the
one you were told about, the inputs actually used, the actual observed result in your own words,
and PASS / FAIL / BLOCKED (with reason). Report each failure as a GitHub Issue on this repository
(label `uat`) or via the agreed chat, with steps, expected, actual, severity and a screenshot.
