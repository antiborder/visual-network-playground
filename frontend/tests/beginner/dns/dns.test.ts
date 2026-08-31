import { describe, expect, it } from "vitest";
import { findRecord, isCacheValid, lookupRecord, resolveHost, type CacheEntry } from "@/features/beginner/dns/dns";

describe("lookupRecord", () => {
  it("returns the IP for a known domain", () => {
    expect(lookupRecord("example.com")).toBe("93.184.216.34");
  });

  it("returns undefined for a domain outside the fake zone", () => {
    expect(lookupRecord("nowhere.test")).toBeUndefined();
  });

  it("does not follow a CNAME — that's resolveHost's job", () => {
    expect(lookupRecord("shop.example.com")).toBeUndefined();
  });
});

describe("findRecord", () => {
  it("finds a record by domain and type", () => {
    expect(findRecord("example.com", "AAAA")).toMatchObject({ value: "2606:2800:220:1:248:1893:25c8:1946" });
    expect(findRecord("example.com", "MX")).toMatchObject({ value: "mail.example.com (priority 10)" });
  });

  it("returns undefined when no record of that type exists for the domain", () => {
    expect(findRecord("example.com", "CNAME")).toBeUndefined();
  });
});

describe("resolveHost", () => {
  it("resolves a plain A record with a chain of just itself", () => {
    expect(resolveHost("example.com")).toEqual({ chain: ["example.com"], ip: "93.184.216.34" });
  });

  it("follows a CNAME to the domain that actually has the A record", () => {
    expect(resolveHost("shop.example.com")).toEqual({
      chain: ["shop.example.com", "example.com"],
      ip: "93.184.216.34",
    });
  });

  it("returns no IP for a domain with no A record anywhere in the chain", () => {
    expect(resolveHost("nowhere.test")).toEqual({ chain: ["nowhere.test"], ip: undefined });
  });
});

describe("isCacheValid", () => {
  const entry: CacheEntry = { ip: "93.184.216.34", cachedAtTick: 10, ttlTicks: 4 };

  it("is false when there is no entry at all", () => {
    expect(isCacheValid(undefined, 10)).toBe(false);
  });

  it("is true within the TTL window", () => {
    expect(isCacheValid(entry, 10)).toBe(true);
    expect(isCacheValid(entry, 13)).toBe(true);
  });

  it("is false once the TTL has elapsed", () => {
    expect(isCacheValid(entry, 14)).toBe(false);
    expect(isCacheValid(entry, 20)).toBe(false);
  });
});
