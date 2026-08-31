import { describe, expect, it } from "vitest";
import { resolveOutcome } from "@/features/beginner/http-status/http";

describe("resolveOutcome", () => {
  it("returns 200 when everything is healthy", () => {
    expect(resolveOutcome("ok", "ok")).toMatchObject({ code: 200 });
  });

  it("returns 502 Bad Gateway when the webserver itself is down", () => {
    expect(resolveOutcome("down", "ok")).toMatchObject({ code: 502, faultyNode: "webserver" });
  });

  it("returns 504 Gateway Timeout when the database is down but the webserver is fine", () => {
    expect(resolveOutcome("ok", "down")).toMatchObject({ code: 504, faultyNode: "database" });
  });

  it("returns 504 Gateway Timeout when the database is merely slow", () => {
    expect(resolveOutcome("ok", "slow")).toMatchObject({ code: 504, faultyNode: "database" });
  });

  it("prioritizes 502 when both the webserver and database are unhealthy", () => {
    expect(resolveOutcome("down", "down")).toMatchObject({ code: 502, faultyNode: "webserver" });
  });
});
