"use client";

import { useState, type ReactNode } from "react";
import { Term } from "@/components/Term";
import { SegmentedProgressBar } from "@/components/SegmentedProgressBar";
import { FirewallGate } from "./FirewallGate";
import { useFirewallSend } from "./useFirewallSend";
import { evaluate, isEstablishedReturn, type Action, type Rule } from "./firewall";

const STARTER_RULES: Rule[] = [
  { id: "web", direction: "IN", port: 443, action: "ALLOW" },
  { id: "ssh", direction: "IN", port: 22, action: "DENY" },
];

const CONFLICT_DENY_FIRST: Rule[] = [
  { id: "deny22", direction: "IN", port: 22, action: "DENY" },
  { id: "allow22", direction: "IN", port: 22, action: "ALLOW" },
];

/** ~14-step teaching sequence for firewall fundamentals: the gate/rule
 * model, order-dependence, default policy, and stateful return traffic.
 * Sections 2-4 each keep their own isolated sandbox. */
export function FirewallWalkthrough({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  // --- "Rule Order Matters" sandbox ---
  const [orderRules, setOrderRules] = useState<Rule[]>(CONFLICT_DENY_FIRST);
  const orderPacket = useFirewallSend();
  const [orderResult, setOrderResult] = useState<{ action: Action; matchedRuleId?: string } | null>(null);
  const swapOrder = () => setOrderRules((rs) => [rs[1], rs[0]]);
  const sendOrderTest = () => {
    const result = evaluate(orderRules, { direction: "IN", port: 22 }, "DENY");
    setOrderResult(result);
    orderPacket.send("IN", result.action === "ALLOW");
  };

  // --- "Default Policy" sandbox ---
  const [defaultPolicy, setDefaultPolicy] = useState<Action>("DENY");
  const defaultPacket = useFirewallSend();
  const [defaultResult, setDefaultResult] = useState<{ action: Action; matchedRuleId?: string } | null>(null);
  const sendDefaultTest = () => {
    const result = evaluate([], { direction: "IN", port: 8080 }, defaultPolicy);
    setDefaultResult(result);
    defaultPacket.send("IN", result.action === "ALLOW");
  };

  // --- "Stateful Return Traffic" sandbox ---
  const [outboundPorts, setOutboundPorts] = useState<Set<number>>(new Set());
  const statefulPacket = useFirewallSend();
  const [statefulNote, setStatefulNote] = useState("");
  const sendOutbound = () => {
    setOutboundPorts((s) => new Set(s).add(443));
    statefulPacket.send("OUT", true);
    setStatefulNote("Outbound request sent on port 443 — this flow is now remembered.");
  };
  const sendEstablishedReply = () => {
    const allowed = isEstablishedReturn(outboundPorts, { direction: "IN", port: 443 });
    statefulPacket.send("IN", allowed);
    setStatefulNote(allowed ? "Matches the flow you started — let through automatically." : "No matching outbound flow.");
  };
  const sendUnsolicited = () => {
    const allowed = isEstablishedReturn(outboundPorts, { direction: "IN", port: 9999 });
    statefulPacket.send("IN", allowed);
    setStatefulNote(allowed ? "Matches the flow you started — let through automatically." : "No outbound flow on port 9999 — blocked by default policy.");
  };
  const resetStateful = () => {
    setOutboundPorts(new Set());
    setStatefulNote("");
    statefulPacket.reset();
  };

  interface Step {
    section: string;
    title: string;
    body: ReactNode;
    visual: ReactNode;
    controls?: ReactNode;
    onAdvance?: () => void;
    resetAction?: () => void;
  }

  const steps: Step[] = [
    // ----------------------------- Welcome ---------------------------
    {
      section: "Welcome",
      title: "What you learn from this chapter",
      body: (
        <div className="space-y-3">
          <p>
            A firewall decides, packet by packet, what gets in and out. You&rsquo;ll see how its
            rules are actually evaluated, and why the order you write them in can matter more
            than the rules themselves.
          </p>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>The Gate</li>
            <li>Rule Order Matters</li>
            <li>Default Policy</li>
            <li>Stateful Return Traffic</li>
          </ol>
        </div>
      ),
      visual: undefined,
    },
    {
      section: "Welcome",
      title: "The chapter at a glance",
      body: (
        <p>
          In short: this chapter follows one gate and its rule list — how a rule is actually
          structured, why the order you write rules in can flip the outcome, what happens when
          nothing matches, and why a reply to your own request needs no rule at all.
        </p>
      ),
      visual: <FirewallGate rules={STARTER_RULES} defaultPolicy="DENY" packet={null} />,
    },
    // ----------------------------- 1. The Gate ------------------------
    {
      section: "1. The Gate",
      title: "Rules made of direction, port, and action",
      body: (
        <p>
          A <Term id="firewall">firewall</Term> sits at the edge of a network and checks every
          packet against a list of rules. Each rule is just three things: a direction (IN or
          OUT), a port, and an action (ALLOW or DENY).
        </p>
      ),
      visual: <FirewallGate rules={STARTER_RULES} defaultPolicy="DENY" packet={null} />,
    },
    {
      section: "1. The Gate",
      title: "Two rules, two outcomes",
      body: (
        <p>
          Here, inbound traffic on port 443 (HTTPS) is allowed, while inbound traffic on port 22
          (SSH) is denied. Every packet gets checked against this list, top to bottom.
        </p>
      ),
      visual: <FirewallGate rules={STARTER_RULES} defaultPolicy="DENY" packet={null} />,
    },
    // ------------------------ 2. Rule Order Matters -------------------
    {
      section: "2. Rule Order Matters",
      title: "Two rules that disagree",
      body: (
        <p>
          These two rules both apply to inbound port 22 — one denies it, one allows it. Send a
          test packet and see which one wins.
        </p>
      ),
      controls: (
        <button
          type="button"
          onClick={sendOrderTest}
          className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
        >
          Send IN port 22
        </button>
      ),
      visual: (
        <FirewallGate rules={orderRules} defaultPolicy="DENY" matchedRuleId={orderResult?.matchedRuleId} packet={orderPacket.state} />
      ),
      resetAction: () => {
        setOrderResult(null);
        orderPacket.reset();
      },
    },
    {
      section: "2. Rule Order Matters",
      title: "Swap the order",
      body: (
        <p>
          The first matching rule wins — everything after it is never even consulted. Swap the
          two rules and send the same test again to watch the outcome flip.
        </p>
      ),
      controls: (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={swapOrder}
            className="px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-900 text-sm font-medium text-white"
          >
            Swap rule order
          </button>
          <button
            type="button"
            onClick={sendOrderTest}
            className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
          >
            Send IN port 22
          </button>
        </div>
      ),
      visual: (
        <FirewallGate rules={orderRules} defaultPolicy="DENY" matchedRuleId={orderResult?.matchedRuleId} packet={orderPacket.state} />
      ),
      onAdvance: () => {
        setOrderRules(CONFLICT_DENY_FIRST);
        setOrderResult(null);
        orderPacket.reset();
      },
      resetAction: () => {
        setOrderRules(CONFLICT_DENY_FIRST);
        setOrderResult(null);
        orderPacket.reset();
      },
    },
    {
      section: "2. Rule Order Matters",
      title: "Same rules, opposite outcome",
      body: (
        <p>
          Nothing about the rules themselves changed — only their order did. A misordered rule
          list is one of the easiest ways a firewall ends up allowing (or blocking) something
          nobody intended.
        </p>
      ),
      visual: undefined,
    },
    // --------------------------- 3. Default Policy --------------------
    {
      section: "3. Default Policy",
      title: "What happens with no matching rule?",
      body: (
        <p>
          Port 8080 has no rule at all here. Whatever happens next is decided by the{" "}
          <Term id="default-deny">default policy</Term> — the fallback for everything the rule
          list doesn&rsquo;t explicitly mention.
        </p>
      ),
      controls: (
        <button
          type="button"
          onClick={sendDefaultTest}
          className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
        >
          Send IN port 8080
        </button>
      ),
      visual: <FirewallGate rules={[]} defaultPolicy={defaultPolicy} matchedRuleId={defaultResult?.matchedRuleId} packet={defaultPacket.state} />,
      resetAction: () => {
        defaultPacket.reset();
        setDefaultResult(null);
      },
    },
    {
      section: "3. Default Policy",
      title: "Flip the default",
      body: (
        <p>
          Switch the default policy and send again. Default-deny only lets through what&rsquo;s
          explicitly written down — the safer starting point for most firewalls; default-allow
          lets through anything nobody thought to block.
        </p>
      ),
      controls: (
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-neutral-300 overflow-hidden text-sm">
            {(["DENY", "ALLOW"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setDefaultPolicy(p)}
                className={`px-3 py-1.5 ${defaultPolicy === p ? "bg-storybook-accent text-white" : "bg-white text-neutral-700 hover:bg-neutral-100"}`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={sendDefaultTest}
            className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
          >
            Send IN port 8080
          </button>
        </div>
      ),
      visual: <FirewallGate rules={[]} defaultPolicy={defaultPolicy} matchedRuleId={defaultResult?.matchedRuleId} packet={defaultPacket.state} />,
      onAdvance: () => {
        setDefaultPolicy("DENY");
        setDefaultResult(null);
        defaultPacket.reset();
      },
      resetAction: () => {
        setDefaultPolicy("DENY");
        setDefaultResult(null);
        defaultPacket.reset();
      },
    },
    // ---------------------- 4. Stateful Return Traffic -----------------
    {
      section: "4. Stateful Return Traffic",
      title: "Send an outbound request",
      body: (
        <p>
          Click to send an outbound request on port 443 — the kind of thing your browser does
          constantly. The firewall quietly remembers this as an established flow.
        </p>
      ),
      controls: (
        <button
          type="button"
          onClick={sendOutbound}
          className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
        >
          Send OUT port 443
        </button>
      ),
      visual: (
        <div className="space-y-2">
          <FirewallGate rules={[]} defaultPolicy="DENY" packet={statefulPacket.state} />
          {statefulNote && <p className="text-sm text-neutral-600">{statefulNote}</p>}
        </div>
      ),
      resetAction: resetStateful,
    },
    {
      section: "4. Stateful Return Traffic",
      title: "The reply comes back — with no inbound rule at all",
      body: (
        <p>
          There isn&rsquo;t a single inbound ALLOW rule in this rule list, and the default policy
          is DENY. Send the reply on port 443 anyway and watch{" "}
          <Term id="stateful-inspection">stateful inspection</Term> let it straight through,
          because it matches the flow you just started.
        </p>
      ),
      controls: (
        <button
          type="button"
          onClick={sendEstablishedReply}
          className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
        >
          Send IN port 443 (the reply)
        </button>
      ),
      visual: (
        <div className="space-y-2">
          <FirewallGate rules={[]} defaultPolicy="DENY" packet={statefulPacket.state} />
          {statefulNote && <p className="text-sm text-neutral-600">{statefulNote}</p>}
        </div>
      ),
      resetAction: () => {
        statefulPacket.reset();
        setStatefulNote("");
      },
    },
    {
      section: "4. Stateful Return Traffic",
      title: "An unsolicited packet gets no such pass",
      body: (
        <p>
          Now try inbound traffic on port 9999 — something you never asked for. With no matching
          flow and no rule to allow it, the default policy blocks it, exactly as it would have
          blocked the reply if you hadn&rsquo;t sent the outbound request first.
        </p>
      ),
      controls: (
        <button
          type="button"
          onClick={sendUnsolicited}
          className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
        >
          Send IN port 9999 (unsolicited)
        </button>
      ),
      visual: (
        <div className="space-y-2">
          <FirewallGate rules={[]} defaultPolicy="DENY" packet={statefulPacket.state} />
          {statefulNote && <p className="text-sm text-neutral-600">{statefulNote}</p>}
        </div>
      ),
      resetAction: () => {
        statefulPacket.reset();
        setStatefulNote("");
      },
    },
    // ------------------------------ Wrap-up --------------------------
    {
      section: "Wrap-up",
      title: "Now it's your turn",
      body: (
        <div className="space-y-3">
          <p>Here&rsquo;s everything this chapter covered:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>A <Term id="firewall">firewall</Term> rule is direction + port + action, checked top to bottom.</li>
            <li>The first matching rule wins — order can matter more than the rules themselves.</li>
            <li>Anything no rule covers falls back to the <Term id="default-deny">default policy</Term>.</li>
            <li><Term id="stateful-inspection">Stateful inspection</Term> auto-allows replies to connections you started, with no inbound rule needed — but gives unsolicited traffic no such pass.</li>
          </ul>
          <p>
            A free-play version of this gate is now unlocked below — build your own rule list and
            test it yourself.
          </p>
        </div>
      ),
      visual: undefined,
    },
  ];

  const total = steps.length;
  const current = steps[step];
  const isLast = step === total - 1;
  const isFirst = step === 0;

  const goNext = () => {
    current.onAdvance?.();
    if (isLast) {
      onComplete();
      return;
    }
    setStep((s) => Math.min(total - 1, s + 1));
  };
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="rounded-lg bg-storybook-paper p-5 space-y-4 font-storybook-body text-storybook-ink">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-center sm:text-left">
        <span className="text-xs uppercase tracking-wide text-storybook-accent-dark sm:flex-1">{current.section}</span>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={goBack}
            disabled={isFirst}
            className="px-3 py-1.5 rounded-md bg-white/70 hover:bg-white disabled:opacity-40 text-sm text-storybook-ink border border-storybook-ink/10"
          >
            Back
          </button>
          <button
            onClick={goNext}
            className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
          >
            {isLast ? "Finish" : "Next"}
          </button>
        </div>
        <span className="text-xs text-storybook-ink/60 sm:flex-1 sm:text-right">
          Step {step + 1} of {total}
        </span>
      </div>

      <SegmentedProgressBar
        sections={steps.map((s) => s.section)}
        currentStep={step}
        onSelectStep={setStep}
        proportional
      />

      <div className="space-y-4">
        <h3 className="text-2xl font-storybook-heading text-storybook-accent">{current.title}</h3>
        <div className="text-sm text-storybook-ink/90 leading-relaxed space-y-3">{current.body}</div>

        {current.controls && (
          <div className="rounded-md border border-storybook-ink/10 bg-white/50 p-3 flex flex-col items-start gap-2">
            {current.controls}
            {current.resetAction && (
              <button
                onClick={current.resetAction}
                className="text-xs text-storybook-ink/60 hover:text-storybook-ink"
              >
                ↺ Undo this step
              </button>
            )}
          </div>
        )}

        {current.visual && <div className="space-y-3">{current.visual}</div>}
      </div>
    </div>
  );
}
