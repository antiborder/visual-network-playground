"use client";

import { useState } from "react";
import { StatCard } from "@/components/StatCard";
import { HttpStatusWalkthrough } from "./HttpStatusWalkthrough";
import { RequestPipeline } from "./RequestPipeline";
import { useRequestSend } from "./useRequestSend";
import { resolveOutcome, type DatabaseState, type WebserverState } from "./http";

export function HttpStatusLab() {
  const [walkthroughComplete, setWalkthroughComplete] = useState(false);
  const [webserver, setWebserver] = useState<WebserverState>("ok");
  const [database, setDatabase] = useState<DatabaseState>("ok");
  const [log, setLog] = useState<string[]>([]);
  const request = useRequestSend();

  const sendRequest = () => {
    const outcome = resolveOutcome(webserver, database);
    const forwardTargetIndex = webserver === "down" ? 2 : 3;
    request.send(forwardTargetIndex, outcome);
    setLog((l) => [`${outcome.code} ${outcome.text}`, ...l].slice(0, 5));
  };

  const reset = () => {
    setWebserver("ok");
    setDatabase("ok");
    setLog([]);
    request.reset();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          A status code is a report from whichever component actually answered — break a
          different one and watch the code (and which node is at fault) change.
        </p>
        <HttpStatusWalkthrough onComplete={() => setWalkthroughComplete(true)} />
      </div>

      {walkthroughComplete && (
        <div>
          <h3 className="text-sm font-medium text-neutral-800 mb-1">Explore it yourself</h3>
          <p className="text-xs text-neutral-500 mb-4">
            Toggle each component&rsquo;s health and send requests to see the resulting status code.
          </p>
          <div className="grid md:grid-cols-[280px_1fr] gap-6">
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setWebserver((w) => (w === "ok" ? "down" : "ok"))}
                className={`w-full px-3 py-1.5 rounded-md text-sm font-medium ${
                  webserver === "down" ? "bg-red-600 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                Webserver: {webserver}
              </button>
              <div className="flex gap-2">
                {(["ok", "down", "slow"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setDatabase(s)}
                    className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium ${
                      database === s
                        ? s === "ok"
                          ? "bg-storybook-accent text-white"
                          : s === "down"
                            ? "bg-red-600 text-white"
                            : "bg-amber-600 text-white"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    DB: {s}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={sendRequest}
                className="w-full px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
              >
                Send request
              </button>

              <StatCard
                label="Last response"
                value={log[0] ?? "—"}
                tone={log[0]?.startsWith("2") ? "good" : log[0] ? "warn" : "default"}
              />

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

            <RequestPipeline webserver={webserver} database={database} request={request.state} />
          </div>
        </div>
      )}
    </div>
  );
}
