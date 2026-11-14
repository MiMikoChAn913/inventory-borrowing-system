import assert from "node:assert/strict";
import test from "node:test";

test("C-02 evidence: a failing test blocks merge to main", () => {
  assert.fail("Intentional temporary failure for CI merge-gate evidence.");
});
