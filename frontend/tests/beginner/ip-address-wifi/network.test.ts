import { describe, expect, it } from "vitest";
import {
  blockSizeForPrefix,
  broadcastOctetForPrefix,
  clampOctet,
  devicesAtOctet,
  findConflicts,
  formatIp,
  isPrivateIpv4,
  isSameSubnet,
  networkOctetForPrefix,
  usableHostCount,
  type Device,
} from "@/features/beginner/ip-address-wifi/network";

describe("formatIp", () => {
  it("prefixes the last octet with the subnet", () => {
    expect(formatIp(10)).toBe("192.168.1.10");
    expect(formatIp(254)).toBe("192.168.1.254");
  });
});

describe("clampOctet", () => {
  it("clamps to the valid host range", () => {
    expect(clampOctet(0)).toBe(1);
    expect(clampOctet(300)).toBe(254);
    expect(clampOctet(120)).toBe(120);
  });

  it("rounds fractional input", () => {
    expect(clampOctet(10.6)).toBe(11);
  });

  it("falls back to the minimum for NaN", () => {
    expect(clampOctet(Number.NaN)).toBe(1);
  });
});

describe("devicesAtOctet", () => {
  const devices: Device[] = [
    { id: "router", label: "Router", kind: "router", lastOctet: 1, mac: "AC:1F:6B:00:01:01" },
    { id: "pc", label: "PC", kind: "pc", lastOctet: 10, mac: "3C:A4:1F:9B:2E:0A" },
    { id: "phone", label: "Phone", kind: "phone", lastOctet: 10, mac: "5C:E8:EB:44:7C:3D" },
  ];

  it("excludes the router even if its octet matches", () => {
    expect(devicesAtOctet(devices, 1).map((d) => d.id)).toEqual([]);
  });

  it("returns every device sharing the given octet", () => {
    expect(devicesAtOctet(devices, 10).map((d) => d.id)).toEqual(["pc", "phone"]);
  });

  it("returns an empty array when no device matches", () => {
    expect(devicesAtOctet(devices, 99)).toEqual([]);
  });
});

describe("findConflicts", () => {
  const base: Device[] = [
    { id: "router", label: "Router", kind: "router", lastOctet: 1, mac: "AC:1F:6B:00:01:01" },
    { id: "pc", label: "PC", kind: "pc", lastOctet: 10, mac: "3C:A4:1F:9B:2E:0A" },
    { id: "phone", label: "Phone", kind: "phone", lastOctet: 11, mac: "5C:E8:EB:44:7C:3D" },
    { id: "iot", label: "Smart bulb", kind: "iot", lastOctet: 12, mac: "B0:4E:26:8F:12:99" },
  ];

  it("finds no conflicts when every device has a unique address", () => {
    expect(findConflicts(base)).toEqual(new Set());
  });

  it("flags exactly the two devices sharing an address", () => {
    const devices = base.map((d) => (d.id === "phone" ? { ...d, lastOctet: 10 } : d));
    expect(findConflicts(devices)).toEqual(new Set(["pc", "phone"]));
  });

  it("never flags the router even if its address collides with a device", () => {
    const devices = base.map((d) => (d.id === "pc" ? { ...d, lastOctet: 1 } : d));
    expect(findConflicts(devices)).toEqual(new Set());
  });

  it("flags all devices in a three-way collision", () => {
    const devices = base.map((d) => (d.kind === "router" ? d : { ...d, lastOctet: 20 }));
    expect(findConflicts(devices)).toEqual(new Set(["pc", "phone", "iot"]));
  });
});

describe("blockSizeForPrefix", () => {
  it("halves as the prefix length grows by one", () => {
    expect(blockSizeForPrefix(24)).toBe(256);
    expect(blockSizeForPrefix(28)).toBe(16);
    expect(blockSizeForPrefix(30)).toBe(4);
  });
});

describe("networkOctetForPrefix / broadcastOctetForPrefix", () => {
  it("covers the whole octet at /24", () => {
    expect(networkOctetForPrefix(137, 24)).toBe(0);
    expect(broadcastOctetForPrefix(137, 24)).toBe(255);
  });

  it("splits the octet into 16-address blocks at /28", () => {
    expect(networkOctetForPrefix(20, 28)).toBe(16);
    expect(broadcastOctetForPrefix(20, 28)).toBe(31);
    expect(networkOctetForPrefix(31, 28)).toBe(16);
    expect(networkOctetForPrefix(32, 28)).toBe(32);
  });
});

describe("usableHostCount", () => {
  it("subtracts the network and broadcast addresses from the block size", () => {
    expect(usableHostCount(24)).toBe(254);
    expect(usableHostCount(30)).toBe(2);
  });
});

describe("isSameSubnet", () => {
  it("is true for two octets in the same /28 block", () => {
    expect(isSameSubnet(18, 25, 28)).toBe(true);
  });

  it("is false for octets in different /28 blocks", () => {
    expect(isSameSubnet(15, 16, 28)).toBe(false);
  });
});

describe("isPrivateIpv4", () => {
  it("recognizes all three RFC1918 ranges", () => {
    expect(isPrivateIpv4(10, 0)).toBe(true);
    expect(isPrivateIpv4(172, 16)).toBe(true);
    expect(isPrivateIpv4(172, 31)).toBe(true);
    expect(isPrivateIpv4(192, 168)).toBe(true);
  });

  it("rejects addresses outside the private ranges", () => {
    expect(isPrivateIpv4(8, 8)).toBe(false);
    expect(isPrivateIpv4(172, 32)).toBe(false);
    expect(isPrivateIpv4(172, 15)).toBe(false);
  });
});
