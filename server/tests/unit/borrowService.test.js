import assert from "node:assert/strict";
import { test } from "node:test";
import { createBorrowService } from "../../src/borrowService.js";

// In-memory stand-in for the Prisma client, enough for returnItem().
const fakeDb = (requests, items) => {
  const tx = {
    borrowRequest: {
      findUnique: async ({ where }) => requests.find((r) => r.id === where.id) ?? null,
      update: async ({ where, data }) => Object.assign(requests.find((r) => r.id === where.id), data),
    },
    item: {
      update: async ({ where, data }) => {
        const item = items.find((i) => i.id === where.id);
        item.availableQuantity += data.availableQuantity.increment;
        return item;
      },
    },
  };
  return { ...tx, $transaction: async (fn) => fn(tx) };
};

const owner = { id: "borrower-1", role: "BORROWER" };
const stranger = { id: "borrower-2", role: "BORROWER" };

// Issue #20 (UAT-06, BR-05): a non-owner must get 403 whatever state the request is in,
// so the response does not disclose another borrower's request status.
for (const status of ["RETURNED", "PENDING", "REJECTED"]) {
  test(`BR-05 #20: non-owner returning another borrower's ${status} request gets 403 and nothing changes`, async () => {
    const requests = [{ id: "req-1", borrowerId: owner.id, itemId: "item-1", quantity: 1, status }];
    const items = [{ id: "item-1", availableQuantity: 4 }];
    const service = createBorrowService(fakeDb(requests, items));

    await assert.rejects(service.returnItem(stranger, "req-1"), (error) => {
      assert.equal(error.status, 403);
      assert.equal(error.code, "FORBIDDEN");
      return true;
    });
    assert.equal(requests[0].status, status);
    assert.equal(items[0].availableQuantity, 4);
  });
}

test("AC-BR-05 #20: owner still gets 409 for a request that is not APPROVED", async () => {
  const requests = [{ id: "req-1", borrowerId: owner.id, itemId: "item-1", quantity: 1, status: "RETURNED" }];
  const items = [{ id: "item-1", availableQuantity: 4 }];
  const service = createBorrowService(fakeDb(requests, items));

  await assert.rejects(service.returnItem(owner, "req-1"), (error) => error.status === 409);
  assert.equal(items[0].availableQuantity, 4);
});
