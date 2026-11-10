import assert from "node:assert/strict";
import test from "node:test";
import {
  assertApproved,
  assertAvailableQuantity,
  assertBorrowerOwnsRequest,
  assertPending,
  assertPositiveQuantity,
} from "../../src/domain/borrowRules.js";

test("AC-BR-01: positive quantity within available stock is accepted", () => {
  assert.doesNotThrow(() => assertAvailableQuantity(3, 2));
});

test("AC-BR-02: quantity must be a positive whole number", () => {
  for (const quantity of [0, -1, 1.5, Number.NaN]) {
    assert.throws(() => assertPositiveQuantity(quantity), (error) => error.code === "BAD_REQUEST");
  }
});

test("AC-BR-03: request greater than available stock is rejected", () => {
  assert.throws(() => assertAvailableQuantity(1, 2), (error) => error.code === "CONFLICT");
});

test("AC-BR-04: only pending requests can be reviewed", () => {
  assert.doesNotThrow(() => assertPending("PENDING"));
  assert.throws(() => assertPending("APPROVED"), (error) => error.code === "CONFLICT");
});

test("AC-BR-05: only approved requests can be returned", () => {
  assert.doesNotThrow(() => assertApproved("APPROVED"));
  assert.throws(() => assertApproved("PENDING"), (error) => error.code === "CONFLICT");
});

test("AC-AUTH-03: borrower cannot return another borrower's request", () => {
  assert.doesNotThrow(() => assertBorrowerOwnsRequest("user-a", "user-a"));
  assert.throws(
    () => assertBorrowerOwnsRequest("user-a", "user-b"),
    (error) => error.code === "FORBIDDEN",
  );
});
