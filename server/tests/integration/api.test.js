import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import supertest from "supertest";
import { createApp } from "../../src/app.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for integration tests.");
}

const db = new PrismaClient();
const app = createApp(db);
const borrower = supertest.agent(app);
const custodian = supertest.agent(app);
const otherBorrower = supertest.agent(app);

const credentials = {
  borrower: { email: "borrower.integration@example.test", password: "borrower-test-password" },
  custodian: { email: "custodian.integration@example.test", password: "custodian-test-password" },
  other: { email: "other.integration@example.test", password: "other-test-password" },
};

let item;

before(async () => {
  await db.borrowRequest.deleteMany();
  await db.session.deleteMany();
  await db.item.deleteMany();
  await db.user.deleteMany();

  await db.user.createMany({
    data: [
      {
        email: credentials.borrower.email,
        displayName: "Integration Borrower",
        passwordHash: await bcrypt.hash(credentials.borrower.password, 4),
        role: "BORROWER",
      },
      {
        email: credentials.custodian.email,
        displayName: "Integration Custodian",
        passwordHash: await bcrypt.hash(credentials.custodian.password, 4),
        role: "CUSTODIAN",
      },
      {
        email: credentials.other.email,
        displayName: "Other Borrower",
        passwordHash: await bcrypt.hash(credentials.other.password, 4),
        role: "BORROWER",
      },
    ],
  });

  item = await db.item.create({
    data: {
      name: "Integration projector",
      description: "Test-only projector",
      totalQuantity: 2,
      availableQuantity: 2,
    },
  });
});

after(async () => {
  await db.$disconnect();
});

test("AC-AUTH-01: protected endpoint rejects unauthenticated request", async () => {
  const response = await supertest(app).get("/api/items");
  assert.equal(response.status, 401);
  assert.equal(response.body.error.code, "UNAUTHENTICATED");
});

test("AC-AUTH-02: invalid password is rejected and valid users receive sessions", async () => {
  const invalid = await supertest(app).post("/api/auth/login").send({
    email: credentials.borrower.email,
    password: "wrong-password",
  });
  assert.equal(invalid.status, 401);

  for (const [agent, account] of [
    [borrower, credentials.borrower],
    [custodian, credentials.custodian],
    [otherBorrower, credentials.other],
  ]) {
    const response = await agent.post("/api/auth/login").send(account);
    assert.equal(response.status, 200);
    assert.match(response.headers["set-cookie"][0], /HttpOnly/);
  }
});

test("AC-AUTH-03: borrower cannot perform custodian operation", async () => {
  const response = await borrower.post("/api/items").send({
    name: "Forbidden item",
    description: "Borrower must not create this",
    totalQuantity: 1,
  });
  assert.equal(response.status, 403);
  assert.equal(response.body.error.code, "FORBIDDEN");
});

test("AC-BR-01/04/05: request, approval and return persist through the API and database", async () => {
  const created = await borrower.post("/api/borrow-requests").send({
    itemId: item.id,
    quantity: 1,
    purpose: "Use in the CPE 334 classroom demonstration",
  });
  assert.equal(created.status, 201);
  assert.equal(created.body.request.status, "PENDING");

  const requestId = created.body.request.id;
  const approved = await custodian.post(`/api/borrow-requests/${requestId}/approve`);
  assert.equal(approved.status, 200);
  assert.equal(approved.body.request.status, "APPROVED");

  const afterApproval = await db.item.findUnique({ where: { id: item.id } });
  assert.equal(afterApproval.availableQuantity, 1);

  const forbiddenReturn = await otherBorrower.post(`/api/borrow-requests/${requestId}/return`);
  assert.equal(forbiddenReturn.status, 403);

  const returned = await borrower.post(`/api/borrow-requests/${requestId}/return`);
  assert.equal(returned.status, 200);
  assert.equal(returned.body.request.status, "RETURNED");

  const persisted = await db.borrowRequest.findUnique({ where: { id: requestId } });
  const afterReturn = await db.item.findUnique({ where: { id: item.id } });
  assert.equal(persisted.status, "RETURNED");
  assert.equal(afterReturn.availableQuantity, 2);
});

test("AC-BR-03: approval rejects unavailable quantity without changing stock", async () => {
  const created = await borrower.post("/api/borrow-requests").send({
    itemId: item.id,
    quantity: 2,
    purpose: "Reserve all projectors for a test",
  });
  assert.equal(created.status, 201);

  await db.item.update({ where: { id: item.id }, data: { availableQuantity: 1 } });
  const response = await custodian.post(`/api/borrow-requests/${created.body.request.id}/approve`);
  assert.equal(response.status, 409);

  const unchanged = await db.item.findUnique({ where: { id: item.id } });
  assert.equal(unchanged.availableQuantity, 1);
});

test("AC-AUTH-04: logout invalidates the stored session", async () => {
  const logout = await borrower.post("/api/auth/logout");
  assert.equal(logout.status, 204);
  const me = await borrower.get("/api/auth/me");
  assert.equal(me.status, 401);
});
