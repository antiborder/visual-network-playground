"use client";

import { useState } from "react";
import { StatCard } from "@/components/StatCard";
import { FirewallWalkthrough } from "./FirewallWalkthrough";
import { FirewallGate } from "./FirewallGate";
import { useFirewallSend } from "./useFirewallSend";
import { evaluate, isEstablishedReturn, type Action, type Direction, type Rule } from "./firewall";

const STARTER_RULES: Rule[] = [
  { id: "web", direction: "IN", port: 443, action: "ALLOW" },
  { id: "ssh", direction: "IN", port: 22, action: "DENY" },
];

let nextId = 1;

export function FirewallLab() {
  const [walkthroughComplete, setWalkthroughComplete] = useState(false);
  const [rules, setRules] = useState<Rule[]>(STARTER_RULES);
  const [defaultPolicy, setDefaultPolicy] = useState<Action>("DENY");
  const [outboundPorts, setOutboundPorts] = useState<Set<number>>(new Set());
  const [testDirection, setTestDirection] = useState<Direction>("IN");
  const [testPort, setTestPort] = useState(443);
  const [newDirection, setNewDirection] = useState<Direction>("IN");
  const [newPort, setNewPort] = useState(80);
  const [newAction, setNewAction] = useState<Action>("ALLOW");
  const [matchedRuleId, setMatchedRuleId] = useState<string | undefined>(undefined);
  const [log, setLog] = useState<string[]>([]);
  const packet = useFirewallSend();

  const move = (index: number, delta: number) => {
    setRules((rs) => {
      const next = [...rs];
      const j = index + delta;
      if (j < 0 || j >= next.length) return rs;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  };

  const removeRule = (id: string) => setRules((rs) => rs.filter((r) => r.id !== id));

  const addRule = () => {
    setRules((rs) => [...rs, { id: `rule-${nextId++}`, direction: newDirection, port: newPort, action: newAction }]);
  };

  const sendTest = () => {
    const established = isEstablishedReturn(outboundPorts, { direction: testDirection, port: testPort });
    let allowed: boolean;
    let ruleId: string | undefined;
    if (established) {
      allowed = true;
    } else {
      const result = evaluate(rules, { direction: testDirection, port: testPort }, defaultPolicy);
      allowed = result.action === "ALLOW";
      ruleId = result.matchedRuleId;
    }
    setMatchedRuleId(ruleId);
    packet.send(testDirection, allowed);
    if (testDirection === "OUT") setOutboundPorts((s) => new Set(s).add(testPort));
    setLog((l) => [
      `${testDirection} ${testPort} → ${allowed ? "ALLOW" : "DENY"}${established ? " (established)" : ""}`,
      ...l,
    ].slice(0, 6));
  };

  const reset = () => {
    setRules(STARTER_RULES);
    setDefaultPolicy("DENY");
    setOutboundPorts(new Set());
    setLog([]);
    setMatchedRuleId(undefined);
    packet.reset();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          A firewall checks every packet against a rule list, top to bottom, and falls back to a
          default policy when nothing matches.
        </p>
        <FirewallWalkthrough onComplete={() => setWalkthroughComplete(true)} />
      </div>

      {walkthroughComplete && (
        <div>
          <h3 className="text-sm font-medium text-neutral-800 mb-1">Explore it yourself</h3>
          <p className="text-xs text-neutral-500 mb-4">
            Build your own rule list, reorder it, and send test packets to see what gets through.
          </p>
          <div className="grid md:grid-cols-[320px_1fr] gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                {rules.map((r, i) => (
                  <div key={r.id} className="flex items-center gap-1 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded px-2 py-1">
                    <span className="flex-1">
                      {r.direction} {r.port} → {r.action}
                    </span>
                    <button type="button" onClick={() => move(i, -1)} className="text-neutral-400 hover:text-neutral-700">
                      ▲
                    </button>
                    <button type="button" onClick={() => move(i, 1)} className="text-neutral-400 hover:text-neutral-700">
                      ▼
                    </button>
                    <button type="button" onClick={() => removeRule(r.id)} className="text-red-400 hover:text-red-700">
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1 text-xs">
                <select value={newDirection} onChange={(e) => setNewDirection(e.target.value as Direction)} className="rounded border border-neutral-300 px-1 py-1">
                  <option value="IN">IN</option>
                  <option value="OUT">OUT</option>
                </select>
                <input
                  type="number"
                  value={newPort}
                  onChange={(e) => setNewPort(Number(e.target.value))}
                  className="w-16 rounded border border-neutral-300 px-1 py-1"
                />
                <select value={newAction} onChange={(e) => setNewAction(e.target.value as Action)} className="rounded border border-neutral-300 px-1 py-1">
                  <option value="ALLOW">ALLOW</option>
                  <option value="DENY">DENY</option>
                </select>
                <button type="button" onClick={addRule} className="px-2 py-1 rounded bg-neutral-800 text-white hover:bg-neutral-900">
                  Add
                </button>
              </div>

              <div className="flex rounded-md border border-neutral-300 overflow-hidden text-xs">
                {(["DENY", "ALLOW"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setDefaultPolicy(p)}
                    className={`flex-1 px-2 py-1.5 ${defaultPolicy === p ? "bg-storybook-accent text-white" : "bg-white text-neutral-700 hover:bg-neutral-100"}`}
                  >
                    default {p}
                  </button>
                ))}
              </div>

              <div className="rounded-md border border-neutral-200 bg-neutral-50 p-2 space-y-1.5">
                <div className="flex gap-1 text-xs">
                  <select value={testDirection} onChange={(e) => setTestDirection(e.target.value as Direction)} className="rounded border border-neutral-300 px-1 py-1">
                    <option value="IN">IN</option>
                    <option value="OUT">OUT</option>
                  </select>
                  <input
                    type="number"
                    value={testPort}
                    onChange={(e) => setTestPort(Number(e.target.value))}
                    className="w-16 rounded border border-neutral-300 px-1 py-1"
                  />
                </div>
                <button
                  type="button"
                  onClick={sendTest}
                  className="w-full px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
                >
                  Send test packet
                </button>
              </div>

              <StatCard label="Last outcome" value={log[0] ?? "—"} tone={log[0]?.includes("ALLOW") ? "good" : log[0] ? "warn" : "default"} />

              {log.length > 0 && (
                <ul className="text-xs text-neutral-500 space-y-0.5">
                  {log.map((entry, i) => (
                    <li key={i} className="font-mono">
                      {entry}
                    </li>
                  ))}
                </ul>
              )}

              <button type="button" onClick={reset} className="text-xs text-neutral-500 hover:text-neutral-800">
                ↺ Reset
              </button>
            </div>

            <FirewallGate rules={rules} defaultPolicy={defaultPolicy} matchedRuleId={matchedRuleId} packet={packet.state} />
          </div>
        </div>
      )}
    </div>
  );
}
