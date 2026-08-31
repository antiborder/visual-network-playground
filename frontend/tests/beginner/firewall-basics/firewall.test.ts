import { describe, expect, it } from "vitest";
import { evaluate, isEstablishedReturn, type Rule } from "@/features/beginner/firewall-basics/firewall";

describe("evaluate", () => {
  it("applies the default policy when no rule matches", () => {
    expect(evaluate([], { direction: "IN", port: 22 }, "DENY")).toEqual({ action: "DENY" });
    expect(evaluate([], { direction: "IN", port: 22 }, "ALLOW")).toEqual({ action: "ALLOW" });
  });

  it("applies the single matching rule", () => {
    const rules: Rule[] = [{ id: "r1", direction: "IN", port: 443, action: "ALLOW" }];
    expect(evaluate(rules, { direction: "IN", port: 443 }, "DENY")).toEqual({ action: "ALLOW", matchedRuleId: "r1" });
  });

  it("is order-dependent: the first matching rule wins even if a later one contradicts it", () => {
    const denyFirst: Rule[] = [
      { id: "deny", direction: "IN", port: 22, action: "DENY" },
      { id: "allow", direction: "IN", port: 22, action: "ALLOW" },
    ];
    expect(evaluate(denyFirst, { direction: "IN", port: 22 }, "DENY")).toEqual({ action: "DENY", matchedRuleId: "deny" });

    const allowFirst: Rule[] = [denyFirst[1], denyFirst[0]];
    expect(evaluate(allowFirst, { direction: "IN", port: 22 }, "DENY")).toEqual({ action: "ALLOW", matchedRuleId: "allow" });
  });

  it("ignores rules for a different direction or port", () => {
    const rules: Rule[] = [{ id: "r1", direction: "OUT", port: 443, action: "ALLOW" }];
    expect(evaluate(rules, { direction: "IN", port: 443 }, "DENY")).toEqual({ action: "DENY" });
    expect(evaluate(rules, { direction: "OUT", port: 80 }, "DENY")).toEqual({ action: "DENY" });
  });
});

describe("isEstablishedReturn", () => {
  it("is true for inbound traffic on a port with a matching outbound flow", () => {
    expect(isEstablishedReturn(new Set([443]), { direction: "IN", port: 443 })).toBe(true);
  });

  it("is false for inbound traffic on a port with no outbound flow", () => {
    expect(isEstablishedReturn(new Set([443]), { direction: "IN", port: 22 })).toBe(false);
  });

  it("is false for outbound traffic regardless of the port", () => {
    expect(isEstablishedReturn(new Set([443]), { direction: "OUT", port: 443 })).toBe(false);
  });
});
