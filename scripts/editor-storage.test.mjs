import assert from "node:assert/strict";
import test from "node:test";
import { resolveEditorStorage } from "../src/lib/editor-storage.ts";

const repo = "supertrens/premier-np-care";

test("development defaults to local and production defaults to GitHub", () => {
  assert.equal(resolveEditorStorage({ repo, isDevelopment: true }).storage.kind, "local");
  assert.equal(resolveEditorStorage({ repo, isDevelopment: false }).storage.kind, "github");
});

test("Cloud is explicit and uses the client project in both environments", () => {
  for (const isDevelopment of [true, false]) {
    assert.deepEqual(resolveEditorStorage({ repo, isDevelopment, mode: "cloud", cloudProject: " client/care " }), {
      storage: { kind: "cloud" }, cloud: { project: "client/care" },
    });
  }
});

test("missing or malformed Cloud project disables editing", () => {
  for (const cloudProject of [undefined, "", "client", "https://keystatic.cloud/client/care"]) {
    assert.ok(resolveEditorStorage({ repo, isDevelopment: false, mode: "cloud", cloudProject }).error);
  }
});

test("production never allows unauthenticated local storage", () => {
  const result = resolveEditorStorage({ repo, isDevelopment: false, mode: "local" });
  assert.ok(result.error);
  assert.notEqual(result.storage.kind, "local");
});

test("unknown storage modes do not silently enable local writes", () => {
  assert.ok(resolveEditorStorage({ repo, isDevelopment: true, mode: "clod" }).error);
});

test("a Cloud project setting does not override explicit GitHub mode", () => {
  assert.deepEqual(resolveEditorStorage({ repo, isDevelopment: false, mode: "github", cloudProject: "client/care" }), {
    storage: { kind: "github", repo },
  });
});
