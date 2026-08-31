export type Direction = "IN" | "OUT";
export type Action = "ALLOW" | "DENY";

export interface Rule {
  id: string;
  direction: Direction;
  port: number;
  action: Action;
}

export interface Packet {
  direction: Direction;
  port: number;
}

export interface EvaluationResult {
  action: Action;
  /** Which rule decided this, or undefined if no rule matched and the
   * default policy applied instead. */
  matchedRuleId?: string;
}

/** Rules are checked top to bottom; the first one whose direction and port
 * match the packet wins, and everything after it is never even looked at.
 * If nothing matches, `defaultPolicy` decides. */
export function evaluate(rules: Rule[], packet: Packet, defaultPolicy: Action): EvaluationResult {
  for (const rule of rules) {
    if (rule.direction === packet.direction && rule.port === packet.port) {
      return { action: rule.action, matchedRuleId: rule.id };
    }
  }
  return { action: defaultPolicy };
}

/** Stateful inspection: an inbound packet on a port you yourself already
 * sent an outbound request from is treated as the *reply* to that request,
 * and let through automatically — no explicit inbound rule required. */
export function isEstablishedReturn(outboundPorts: Set<number>, packet: Packet): boolean {
  return packet.direction === "IN" && outboundPorts.has(packet.port);
}
