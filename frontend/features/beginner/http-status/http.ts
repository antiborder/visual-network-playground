export type WebserverState = "ok" | "down";
export type DatabaseState = "ok" | "down" | "slow";

export interface Outcome {
  code: number;
  text: string;
  category: "2xx" | "5xx";
  faultyNode?: "webserver" | "database";
}

/** Which status code a request actually gets back, given the health of the
 * two components it depends on. The load balancer is the one reporting the
 * code, but it's only ever relaying what happened further upstream:
 * - the webserver itself being unreachable is a **502 Bad Gateway** — the
 *   LB got back something that wasn't a valid response at all.
 * - the webserver being fine but stuck waiting on a dead/slow database is a
 *   **504 Gateway Timeout** — nothing invalid came back, nothing came back
 *   in time.
 */
export function resolveOutcome(webserver: WebserverState, database: DatabaseState): Outcome {
  if (webserver === "down") {
    return { code: 502, text: "Bad Gateway", category: "5xx", faultyNode: "webserver" };
  }
  if (database === "down" || database === "slow") {
    return { code: 504, text: "Gateway Timeout", category: "5xx", faultyNode: "database" };
  }
  return { code: 200, text: "OK", category: "2xx" };
}

export interface StatusExample {
  code: number;
  text: string;
  category: "2xx" | "3xx" | "4xx" | "5xx";
  meaning: string;
}

/** One representative code per family, for the "what do the categories
 * mean" step — deliberately separate from resolveOutcome, which only ever
 * produces the two 5xx codes this chapter's pipeline can actually trigger. */
export const STATUS_EXAMPLES: StatusExample[] = [
  { code: 200, text: "OK", category: "2xx", meaning: "The request succeeded." },
  { code: 301, text: "Moved Permanently", category: "3xx", meaning: "Go look somewhere else instead — permanently." },
  { code: 404, text: "Not Found", category: "4xx", meaning: "You (the client) asked for something that doesn't exist." },
  { code: 500, text: "Internal Server Error", category: "5xx", meaning: "The server broke while handling a request it understood fine." },
];
