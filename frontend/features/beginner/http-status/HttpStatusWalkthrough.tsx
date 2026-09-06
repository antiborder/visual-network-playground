"use client";

import { useState, type ReactNode } from "react";
import { Term } from "@/components/Term";
import { SegmentedProgressBar } from "@/components/SegmentedProgressBar";
import { RequestPipeline } from "./RequestPipeline";
import { useRequestSend } from "./useRequestSend";
import { resolveOutcome, STATUS_EXAMPLES, type DatabaseState, type WebserverState } from "./http";

const CATEGORY_COLOR: Record<string, string> = {
  "2xx": "text-emerald-600",
  "3xx": "text-cyan-700",
  "4xx": "text-amber-600",
  "5xx": "text-red-600",
};

/** ~13-step teaching sequence for HTTP request/response basics and
 * diagnosing 502 vs 504. Sections "1"-"3" each keep a small isolated
 * sandbox; Section "4" keeps one shared pipeline sandbox across its Steps
 * since diagnosing a fault means comparing outcomes from the same
 * pipeline under different health states. */
export function HttpStatusWalkthrough({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  // --- "GET vs POST" sandbox ---
  const [method, setMethod] = useState<"GET" | "POST">("GET");

  // --- "Status Code Families" sandbox ---
  const [exampleIdx, setExampleIdx] = useState(0);

  // --- "Diagnosing 502 vs 504" sandbox ---
  const [webserver, setWebserver] = useState<WebserverState>("ok");
  const [database, setDatabase] = useState<DatabaseState>("ok");
  const request = useRequestSend();

  const sendRequest = () => {
    const outcome = resolveOutcome(webserver, database);
    const forwardTargetIndex = webserver === "down" ? 2 : 3;
    request.send(forwardTargetIndex, outcome);
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
            Every web page starts with a request and ends with a response, tagged with a status
            code. You&rsquo;ll see what that code is really reporting, and how to tell two very
            different failures — 502 and 504 — apart.
          </p>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>Request &amp; Response</li>
            <li>GET vs POST</li>
            <li>Status Code Families</li>
            <li>Diagnosing 502 vs 504</li>
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
          In short: this chapter follows a single request through a pipeline — what a request
          and response actually are, the two methods you&rsquo;ll see most, the code families a
          response can belong to, and how to tell two very different failures apart.
        </p>
      ),
      visual: <RequestPipeline webserver="ok" database="ok" request={null} />,
    },
    // --------------------- 1. Request & Response ----------------------
    {
      section: "1. Request & Response",
      title: "A request, then a response",
      body: (
        <p>
          <Term id="http">HTTP</Term> is the back-and-forth a browser and a server use to talk:
          the browser sends a request (a method, a path, maybe some data), and the server sends
          back a response — a status code plus whatever content goes with it.
        </p>
      ),
      visual: <RequestPipeline webserver="ok" database="ok" request={null} />,
    },
    {
      section: "1. Request & Response",
      title: "No memory between requests",
      body: (
        <p>
          On its own, HTTP is <Term id="stateless">stateless</Term>: the server handling your
          second request has no built-in memory of your first one. Anything that feels
          continuous — staying logged in, a shopping cart — is something built on top of HTTP, not
          part of it.
        </p>
      ),
      visual: <RequestPipeline webserver="ok" database="ok" request={null} />,
    },
    // ------------------------- 2. GET vs POST -------------------------
    {
      section: "2. GET vs POST",
      title: "Retrieving vs. submitting",
      body: (
        <p>
          <span className="font-mono text-neutral-800">GET</span> asks for something without
          changing anything — loading a page, fetching a profile.{" "}
          <span className="font-mono text-neutral-800">POST</span> submits something that&rsquo;s
          meant to change state — logging in, posting a comment, placing an order.
        </p>
      ),
      visual: (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 max-w-xl w-full font-mono text-sm text-neutral-800">
          GET /articles/42
        </div>
      ),
    },
    {
      section: "2. GET vs POST",
      title: "Try both",
      body: (
        <p>
          Switch the method and look at what the request line becomes. A GET&rsquo;s data (if any)
          rides along in the URL; a POST&rsquo;s data travels separately, in the body.
        </p>
      ),
      controls: (
        <div className="flex rounded-md border border-neutral-300 overflow-hidden text-sm">
          {(["GET", "POST"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`px-4 py-1.5 ${method === m ? "bg-storybook-accent text-white" : "bg-white text-neutral-700 hover:bg-neutral-100"}`}
            >
              {m}
            </button>
          ))}
        </div>
      ),
      visual: (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 max-w-xl w-full font-mono text-sm text-neutral-800 whitespace-pre">
          {method === "GET" ? "GET /search?q=network+basics" : "POST /login\n  { \"username\": \"...\", \"password\": \"...\" }"}
        </div>
      ),
      resetAction: () => setMethod("GET"),
    },
    // --------------------- 3. Status Code Families --------------------
    {
      section: "3. Status Code Families",
      title: "Four families of answers",
      body: (
        <p>
          Every status code falls into one of four families by its first digit:{" "}
          <span className="text-emerald-600 font-medium">2xx</span> success,{" "}
          <span className="text-cyan-700 font-medium">3xx</span> redirect,{" "}
          <span className="text-amber-600 font-medium">4xx</span> the client&rsquo;s problem,{" "}
          <span className="text-red-600 font-medium">5xx</span> the server&rsquo;s problem.
        </p>
      ),
      visual: undefined,
    },
    {
      section: "3. Status Code Families",
      title: "Click through some examples",
      body: <p>Click a code to see which family it belongs to and what it actually means.</p>,
      controls: (
        <div className="flex flex-wrap gap-2">
          {STATUS_EXAMPLES.map((ex, i) => (
            <button
              key={ex.code}
              type="button"
              onClick={() => setExampleIdx(i)}
              className={`px-3 py-1.5 rounded-md text-sm font-mono ${
                exampleIdx === i ? "bg-storybook-accent text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {ex.code}
            </button>
          ))}
        </div>
      ),
      visual: (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 max-w-xl w-full space-y-1">
          <div className={`font-mono text-lg font-medium ${CATEGORY_COLOR[STATUS_EXAMPLES[exampleIdx].category]}`}>
            {STATUS_EXAMPLES[exampleIdx].code} {STATUS_EXAMPLES[exampleIdx].text}
          </div>
          <div className="text-sm text-neutral-600">{STATUS_EXAMPLES[exampleIdx].meaning}</div>
        </div>
      ),
      resetAction: () => setExampleIdx(0),
    },
    // --------------------- 4. Diagnosing 502 vs 504 --------------------
    {
      section: "4. Diagnosing 502 vs 504",
      title: "A healthy request",
      body: (
        <p>
          Client → load balancer → webserver → database, and back. Send a request while
          everything&rsquo;s healthy to see the normal round trip.
        </p>
      ),
      controls: (
        <button
          type="button"
          onClick={sendRequest}
          className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
        >
          Send request
        </button>
      ),
      visual: <RequestPipeline webserver={webserver} database={database} request={request.state} />,
      resetAction: request.reset,
    },
    {
      section: "4. Diagnosing 502 vs 504",
      title: "Break the webserver",
      body: (
        <p>
          Take the webserver down, then send again. The load balancer can&rsquo;t get any valid
          response back from it at all — that&rsquo;s a{" "}
          <Term id="bad-gateway">502 Bad Gateway</Term>.
        </p>
      ),
      controls: (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWebserver((w) => (w === "ok" ? "down" : "ok"))}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              webserver === "down" ? "bg-red-600 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {webserver === "down" ? "Bring webserver back up" : "Take webserver down"}
          </button>
          <button
            type="button"
            onClick={sendRequest}
            className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
          >
            Send request
          </button>
        </div>
      ),
      visual: <RequestPipeline webserver={webserver} database={database} request={request.state} />,
      onAdvance: () => {
        setWebserver("ok");
        request.reset();
      },
      resetAction: () => {
        setWebserver("ok");
        request.reset();
      },
    },
    {
      section: "4. Diagnosing 502 vs 504",
      title: "Fix it, break the database instead",
      body: (
        <p>
          Now the webserver itself is fine — it answers — but it&rsquo;s stuck waiting on a
          database that never responds. From the load balancer&rsquo;s side, nothing came back in
          time at all: a <Term id="gateway-timeout">504 Gateway Timeout</Term>, not a 502.
        </p>
      ),
      controls: (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDatabase((d) => (d === "ok" ? "down" : "ok"))}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              database === "down" ? "bg-red-600 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {database === "down" ? "Bring database back up" : "Take database down"}
          </button>
          <button
            type="button"
            onClick={sendRequest}
            className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
          >
            Send request
          </button>
        </div>
      ),
      visual: <RequestPipeline webserver={webserver} database={database} request={request.state} />,
      onAdvance: () => {
        setDatabase("ok");
        request.reset();
      },
      resetAction: () => {
        setDatabase("ok");
        request.reset();
      },
    },
    {
      section: "4. Diagnosing 502 vs 504",
      title: "Slow counts as timed out, too",
      body: (
        <p>
          The database doesn&rsquo;t have to be fully down to cause this — merely too slow to
          answer in time produces the exact same <Term id="gateway-timeout">504</Term>. A 504
          only ever says &ldquo;nothing came back in time,&rdquo; not what was actually wrong further behind.
        </p>
      ),
      controls: (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDatabase((d) => (d === "ok" ? "slow" : "ok"))}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              database === "slow" ? "bg-amber-600 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {database === "slow" ? "Speed database back up" : "Make database slow"}
          </button>
          <button
            type="button"
            onClick={sendRequest}
            className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
          >
            Send request
          </button>
        </div>
      ),
      visual: <RequestPipeline webserver={webserver} database={database} request={request.state} />,
      resetAction: () => {
        setDatabase("ok");
        request.reset();
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
            <li><Term id="http">HTTP</Term> is a stateless request/response exchange — no memory between requests on its own.</li>
            <li>GET retrieves without changing anything; POST submits data meant to change state.</li>
            <li>Status codes fall into four families by their first digit: 2xx, 3xx, 4xx, 5xx.</li>
            <li>A <Term id="bad-gateway">502</Term> means an invalid response came back; a <Term id="gateway-timeout">504</Term> means nothing came back in time — and each points at a different component to check first.</li>
          </ul>
          <p>
            A free-play version of this pipeline is now unlocked below — break things yourself and
            watch the status code follow.
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
