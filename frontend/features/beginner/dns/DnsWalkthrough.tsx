"use client";

import { useState, type ReactNode } from "react";
import { Term } from "@/components/Term";
import { SegmentedProgressBar } from "@/components/SegmentedProgressBar";
import { DnsLookupChain } from "./DnsLookupChain";
import { UrlAnatomy } from "./UrlAnatomy";
import { DomainHierarchy } from "./DomainHierarchy";
import { ResolverRoles } from "./ResolverRoles";
import { RecursiveVsIterative } from "./RecursiveVsIterative";
import { FullPipelineRecap, type PipelineStage } from "./FullPipelineRecap";
import {
  DEFAULT_TTL_TICKS,
  findRecord,
  isCacheValid,
  lookupRecord,
  resolveHost,
  type CacheEntry,
} from "./dns";

const DOMAIN = "example.com";
const FULL_CHAIN = ["Your Device", "Recursive Resolver", "Root", "TLD", "Authoritative"];
const CACHE_HIT_CHAIN = ["Your Device", "Recursive Resolver"];
const EXAMPLE_DOMAINS = ["www.example.com", "shop.example.com", "mail.google.co.jp"];
const CNAME_DOMAIN = "shop.example.com";
const ORIGINAL_IP = lookupRecord(DOMAIN)!;
const MIGRATED_IP = "198.51.100.42";

const PIPELINE_STAGES: PipelineStage[] = [
  { label: "Pull the host out of the URL", detail: "https://shop.example.com/cart?id=42 → shop.example.com" },
  { label: "Check the hosts file", detail: "no manual override for this name" },
  { label: "Check local caches", detail: "browser, OS, and the resolver's notebook — all empty" },
  { label: "Ask the root", detail: "referral: try the .com TLD servers" },
  { label: "Ask the TLD server", detail: "referral (an NS record): try example.com's authoritative servers" },
  { label: "Ask the authoritative server", detail: "shop.example.com is a CNAME → restart for example.com" },
  { label: "Ask the authoritative server again", detail: "example.com's A record: 93.184.216.34" },
  { label: "Cache the answer", detail: "written into the resolver's notebook with its TTL" },
  { label: "Return the address to your device", detail: "DNS's job ends here" },
];

/** ~20-step teaching sequence for DNS, covering: what DNS actually is and
 * where a domain name sits inside a URL, domain-name hierarchy, the real
 * resolver architecture (stub → recursive → root → TLD → authoritative,
 * recursive vs. iterative queries), caching/TTL, who actually operates the
 * authoritative server (registrar vs. DNS hosting), and the record types
 * beyond A (AAAA, CNAME, MX, and a brief note on TXT/NS/SOA). Sections
 * "4"/"5" deliberately share one lookup/cache sandbox for the same reason
 * as before: caching only makes sense against a lookup that already
 * happened. */
export function DnsWalkthrough({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  // --- "Why a name at all?" sandbox ---
  const [serverIp, setServerIp] = useState(ORIGINAL_IP);
  const migrateServer = () => setServerIp((ip) => (ip === ORIGINAL_IP ? MIGRATED_IP : ORIGINAL_IP));

  // --- "Domain Name Structure" sandbox ---
  const [domainIdx, setDomainIdx] = useState(0);

  // --- "The Chain of Lookups" / "Caching" / "When the Cache Expires" sandbox ---
  const [nowTick, setNowTick] = useState(0);
  const [cache, setCache] = useState<CacheEntry | undefined>(undefined);
  const [lookupPath, setLookupPath] = useState<string[]>(FULL_CHAIN);
  const [visitedCount, setVisitedCount] = useState(0);
  const [resolved, setResolved] = useState(false);

  const cacheIsValid = isCacheValid(cache, nowTick);

  const startLookup = () => {
    const path = isCacheValid(cache, nowTick) ? CACHE_HIT_CHAIN : FULL_CHAIN;
    setLookupPath(path);
    setVisitedCount(1);
    setResolved(false);
  };

  const nextHop = () => {
    setVisitedCount((v) => {
      const next = Math.min(lookupPath.length, v + 1);
      if (next === lookupPath.length) {
        setResolved(true);
        if (lookupPath.length > 2) {
          setCache({ ip: resolveHost(DOMAIN).ip!, cachedAtTick: nowTick, ttlTicks: DEFAULT_TTL_TICKS });
        }
      }
      return next;
    });
  };

  const resetLookupAnimation = () => {
    setVisitedCount(0);
    setResolved(false);
  };

  // --- "Record Types" sandbox ---
  const [addressType, setAddressType] = useState<"A" | "AAAA">("A");
  const [cnameVisited, setCnameVisited] = useState(0);
  const [cnameResolved, setCnameResolved] = useState(false);
  const cnameChain = resolveHost(CNAME_DOMAIN);
  const startCname = () => {
    setCnameVisited(1);
    setCnameResolved(false);
  };
  const nextCnameHop = () => {
    setCnameVisited((v) => {
      const next = Math.min(cnameChain.chain.length, v + 1);
      if (next === cnameChain.chain.length) setCnameResolved(true);
      return next;
    });
  };

  // --- "Putting It All Together" sandbox ---
  const [pipelineRevealed, setPipelineRevealed] = useState(0);
  const nextPipelineStage = () => setPipelineRevealed((v) => Math.min(PIPELINE_STAGES.length, v + 1));

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
            Typing a name instead of a string of numbers is the easy part. You&rsquo;ll see what
            DNS actually is, the real chain of servers behind a lookup, who operates them in
            practice, and the handful of record types that make it more than just &ldquo;name in,
            address out.&rdquo;
          </p>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>What Is DNS?</li>
            <li>Domain Name Structure</li>
            <li>Meeting the Resolvers</li>
            <li>Walking the Chain</li>
            <li>Caching &amp; TTL</li>
            <li>Who Runs the Authoritative Server?</li>
            <li>Record Types</li>
            <li>Putting It All Together</li>
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
          In short: this chapter follows one URL from the moment it&rsquo;s typed to the moment
          an address comes back — why a name is used at all, the real chain of servers
          involved, who actually operates them, and the handful of record types beyond a plain
          address.
        </p>
      ),
      visual: <UrlAnatomy url="https://shop.example.com/cart?id=42" />,
    },
    // --------------------------- 1. What Is DNS? ----------------------
    {
      section: "1. What Is DNS?",
      title: "A number would work too — so why a name?",
      body: (
        <div className="space-y-2">
          <p>
            A name like {DOMAIN} is easier for a person to remember than a string of numbers —
            but the bigger reason is that the number behind it can change.
          </p>
          <p>
            Servers get migrated, load gets moved to a new machine, and none of that should mean
            everyone has to learn a new address.
          </p>
        </div>
      ),
      visual: (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 max-w-xl w-full">
          <div className="text-xs text-neutral-500">{DOMAIN}</div>
          <div className="font-mono text-lg text-neutral-800">{serverIp}</div>
        </div>
      ),
    },
    {
      section: "1. What Is DNS?",
      title: "Migrate the server, keep the name",
      body: (
        <p>
          Click to move {DOMAIN} to a new server. The address changes underneath — but the name
          everyone already typed, bookmarked, and linked to never has to.
        </p>
      ),
      controls: (
        <button
          type="button"
          onClick={migrateServer}
          className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
        >
          {serverIp === ORIGINAL_IP ? "Migrate to a new server" : "Migrate back"}
        </button>
      ),
      visual: (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 max-w-xl w-full">
          <div className="text-xs text-neutral-500">{DOMAIN}</div>
          <div className="font-mono text-lg text-neutral-800">{serverIp}</div>
        </div>
      ),
      resetAction: () => setServerIp(ORIGINAL_IP),
    },
    {
      section: "1. What Is DNS?",
      title: "A distributed, hierarchical phonebook",
      body: (
        <p>
          <Term id="dns">DNS</Term> (Domain Name System) is the system that maps human-readable
          names to the machine addresses that actually locate something on a network. No single
          server holds every answer — the job is spread across many servers, organized into
          levels of authority.
        </p>
      ),
      visual: <UrlAnatomy url="https://shop.example.com/cart?id=42" />,
    },
    {
      section: "1. What Is DNS?",
      title: "Where the domain name lives inside a URL",
      body: (
        <p>
          A <Term id="url">URL</Term> is more than just a domain name — it&rsquo;s a scheme, a
          host, an optional port, a path, and an optional query string. DNS only ever resolves
          one of those pieces: the host.
        </p>
      ),
      visual: <UrlAnatomy url="https://shop.example.com:443/cart?id=42" />,
    },
    // --------------------- 2. Domain Name Structure -------------------
    {
      section: "2. Domain Name Structure",
      title: "Read right to left",
      body: (
        <p>
          A domain name is a chain of dot-separated labels, and authority flows through it right
          to left: the root delegates a top-level domain (like{" "}
          <span className="font-mono text-neutral-800">.com</span>) to a registry, which
          delegates a second-level domain (like{" "}
          <span className="font-mono text-neutral-800">example.com</span>) to whoever registered
          it, which can delegate subdomains further still.
        </p>
      ),
      visual: <DomainHierarchy domain={EXAMPLE_DOMAINS[domainIdx]} />,
    },
    {
      section: "2. Domain Name Structure",
      title: "Try a few names",
      body: <p>Click through a few real-shaped names and watch the same right-to-left pattern hold.</p>,
      controls: (
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_DOMAINS.map((d, i) => (
            <button
              key={d}
              type="button"
              onClick={() => setDomainIdx(i)}
              className={`px-3 py-1.5 rounded-md text-sm font-mono ${
                domainIdx === i ? "bg-storybook-accent text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      ),
      visual: <DomainHierarchy domain={EXAMPLE_DOMAINS[domainIdx]} />,
      resetAction: () => setDomainIdx(0),
    },
    // ------------------- 3. Meeting the Resolvers ---------------------
    {
      section: "3. Meeting the Resolvers",
      title: "Before asking anyone at all",
      body: (
        <p>
          Your device checks one more thing first: a local{" "}
          <span className="font-mono text-neutral-800">hosts</span> file — a short, manually
          edited list of overrides. If a name is listed there, resolution stops right there; no
          question ever goes out to anyone.
        </p>
      ),
      visual: (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 max-w-xl w-full font-mono text-xs text-neutral-700 space-y-1">
          <div className="text-xs uppercase tracking-wide text-neutral-400 font-sans mb-1">hosts file</div>
          <div>127.0.0.1 &nbsp; localhost</div>
          <div>93.184.216.34 &nbsp; example.com <span className="text-amber-600">← manual override</span></div>
        </div>
      ),
    },
    {
      section: "3. Meeting the Resolvers",
      title: "Where did your device get that address?",
      body: (
        <p>
          Nothing&rsquo;s listed for most names, so the question does go somewhere: the recursive
          resolver. But how does your device know which one to ask? The same way it got its own{" "}
          <Term id="ip-address">IP address</Term> in the last chapter —{" "}
          <Term id="dhcp">DHCP</Term> hands out a recursive resolver&rsquo;s address right
          alongside it.
        </p>
      ),
      visual: undefined,
    },
    {
      section: "3. Meeting the Resolvers",
      title: "Two very different resolvers",
      body: (
        <p>
          Your device&rsquo;s <Term id="stub-resolver">stub resolver</Term> only ever talks to
          one server: the <Term id="recursive-resolver">recursive resolver</Term>. Everything
          below that line is work the resolver does for you, not a second hop your device makes.
        </p>
      ),
      visual: <ResolverRoles />,
    },
    {
      section: "3. Meeting the Resolvers",
      title: "What a cache actually is",
      body: (
        <p>
          Before you see the full lookup chain, it&rsquo;s worth knowing what&rsquo;s waiting
          partway through it: the recursive resolver keeps a notebook of answers it has already
          worked out, each with an expiry. If your answer is already written down and still
          valid, it skips the rest of the chain entirely.
        </p>
      ),
      visual: (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 max-w-xl w-full font-mono text-xs text-neutral-700 space-y-1">
          <div className="text-xs uppercase tracking-wide text-neutral-400 font-sans mb-1">
            Recursive resolver&rsquo;s notebook
          </div>
          <div>example.com → 93.184.216.34 (expires in 4 ticks)</div>
          <div className="text-neutral-400">shop.example.com → (not yet looked up)</div>
        </div>
      ),
    },
    {
      section: "3. Meeting the Resolvers",
      title: "More than one notebook",
      body: (
        <p>
          The resolver&rsquo;s isn&rsquo;t the only one — your browser and your OS each keep
          their own, even shorter-lived caches, checked before a question ever reaches the
          resolver. This chapter simplifies to just the resolver&rsquo;s notebook, since
          that&rsquo;s the one doing the real work either way.
        </p>
      ),
      visual: undefined,
    },
    {
      section: "3. Meeting the Resolvers",
      title: "Two styles of question",
      body: (
        <p>
          Your one question to the resolver gets one final answer back. Each of the
          resolver&rsquo;s own questions gets back either a referral (&ldquo;try this other server
          next&rdquo;) or, only on the last try, the actual answer.
        </p>
      ),
      visual: <RecursiveVsIterative />,
    },
    // --------------------- 4. Walking the Chain -----------------------
    {
      section: "4. Walking the Chain",
      title: "Walk it yourself",
      body: (
        <p>
          Nothing is cached yet, so this lookup has to go all the way to the authoritative
          server. Click through one hop at a time.
        </p>
      ),
      controls: (
        <button
          type="button"
          onClick={visitedCount === 0 ? startLookup : nextHop}
          disabled={resolved}
          className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark disabled:opacity-40 text-sm font-medium text-white"
        >
          {visitedCount === 0
            ? "Start lookup"
            : resolved
              ? "Resolved"
              : `Next hop: ${lookupPath[visitedCount]}`}
        </button>
      ),
      visual: (
        <DnsLookupChain path={lookupPath} visitedCount={visitedCount} resolved={resolved} answer={cache?.ip} recursiveBoundary={1} />
      ),
      onAdvance: resetLookupAnimation,
      resetAction: () => {
        resetLookupAnimation();
        setCache(undefined);
      },
    },
    {
      section: "4. Walking the Chain",
      title: "One recursive question, four iterative ones",
      body: (
        <p>
          Only the first leg — your device to the resolver — was recursive. Everything from
          there on (root, TLD, authoritative) was the resolver working iteratively, and it&rsquo;s
          now written the answer into its notebook for next time.
        </p>
      ),
      visual: (
        <DnsLookupChain path={lookupPath} visitedCount={visitedCount} resolved={resolved} answer={cache?.ip} recursiveBoundary={1} />
      ),
    },
    // -------------------------- 5. Caching & TTL -----------------------
    {
      section: "5. Caching & TTL",
      title: "Look it up again",
      body: (
        <p>
          Look up {DOMAIN} a second time. Watch how short the route is — the resolver&rsquo;s
          notebook answers directly, with no need to bother the root,{" "}
          <span className="font-mono text-neutral-800">.com</span>, or the authoritative server
          again.
        </p>
      ),
      controls: (
        <button
          type="button"
          onClick={visitedCount === 0 ? startLookup : nextHop}
          disabled={resolved}
          className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark disabled:opacity-40 text-sm font-medium text-white"
        >
          {visitedCount === 0
            ? "Look up again"
            : resolved
              ? "Resolved"
              : `Next hop: ${lookupPath[visitedCount]}`}
        </button>
      ),
      visual: (
        <DnsLookupChain path={lookupPath} visitedCount={visitedCount} resolved={resolved} answer={cache?.ip} recursiveBoundary={1} />
      ),
      onAdvance: resetLookupAnimation,
      resetAction: resetLookupAnimation,
    },
    {
      section: "5. Caching & TTL",
      title: "Advance time past the TTL",
      body: (
        <p>
          Every notebook entry carries a <Term id="ttl">TTL</Term> — this one lasts{" "}
          {DEFAULT_TTL_TICKS} ticks. Click to let time pass and watch it expire.
        </p>
      ),
      controls: (
        <button
          type="button"
          onClick={() => setNowTick((t) => t + 1)}
          className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
        >
          Advance time (+1 tick)
        </button>
      ),
      visual: (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 max-w-xl w-full space-y-1">
          <div className="text-sm text-neutral-600">
            Now: <span className="font-mono text-neutral-800">tick {nowTick}</span>
          </div>
          <div className={`text-sm font-medium ${cacheIsValid ? "text-emerald-600" : "text-red-600"}`}>
            Notebook entry is {cacheIsValid ? "still valid" : "expired"}
          </div>
        </div>
      ),
      resetAction: () => setNowTick(0),
    },
    {
      section: "5. Caching & TTL",
      title: "Look up again — cache miss",
      body: (
        <div className="space-y-2">
          <p>
            With the entry expired, the resolver can&rsquo;t trust it any more and walks the
            whole chain again — exactly like the very first lookup.
          </p>
          <p>
            A longer TTL means fewer of these full walks, but also a longer window where a stale
            answer could be handed out if the real address changed in the meantime. TTL is a
            speed/freshness trade-off, not a free win.
          </p>
        </div>
      ),
      controls: (
        <button
          type="button"
          onClick={visitedCount === 0 ? startLookup : nextHop}
          disabled={resolved}
          className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark disabled:opacity-40 text-sm font-medium text-white"
        >
          {visitedCount === 0
            ? "Look up again"
            : resolved
              ? "Resolved"
              : `Next hop: ${lookupPath[visitedCount]}`}
        </button>
      ),
      visual: (
        <DnsLookupChain path={lookupPath} visitedCount={visitedCount} resolved={resolved} answer={cache?.ip} recursiveBoundary={1} />
      ),
      onAdvance: resetLookupAnimation,
      resetAction: resetLookupAnimation,
    },
    // --------------- 6. Who Runs the Authoritative Server? -------------
    {
      section: "6. Who Runs the Authoritative Server?",
      title: "Buying a name vs. hosting its records",
      body: (
        <div className="space-y-2">
          <p>
            Buying {DOMAIN} from a <Term id="registrar">registrar</Term> (say, a company like
            Namecheap or GoDaddy) is a separate transaction from deciding whose servers actually
            answer lookups for it.
          </p>
          <p>
            In practice, many domains have their records hosted by a managed DNS service —{" "}
            <span className="text-neutral-800 font-medium">AWS Route 53</span>, Cloudflare DNS,
            and Google Cloud DNS are common ones — which may be a completely different company
            than the registrar.
          </p>
        </div>
      ),
      visual: undefined,
    },
    {
      section: "6. Who Runs the Authoritative Server?",
      title: "Delegation via NS records",
      body: (
        <p>
          The TLD server doesn&rsquo;t store {DOMAIN}&rsquo;s actual records — it stores an{" "}
          <span className="font-mono text-neutral-800">NS</span> record pointing at whichever
          nameservers the DNS host runs. That record is the entire delegation: &ldquo;for {DOMAIN}, go
          ask these servers instead.&rdquo;
        </p>
      ),
      visual: (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 max-w-xl w-full font-mono text-sm text-neutral-800">
          {DOMAIN} NS → {findRecord(DOMAIN, "NS")?.value}
        </div>
      ),
    },
    // --------------------------- 7. Record Types -----------------------
    {
      section: "7. Record Types",
      title: "A vs. AAAA",
      body: (
        <p>
          An <Term id="a-record">A record</Term> maps a name to an IPv4 address; an{" "}
          <Term id="aaaa-record">AAAA record</Term> maps the same name to an IPv6 address
          instead. Switch between them below.
        </p>
      ),
      controls: (
        <div className="flex rounded-md border border-neutral-300 overflow-hidden text-sm">
          {(["A", "AAAA"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setAddressType(t)}
              className={`px-4 py-1.5 ${addressType === t ? "bg-storybook-accent text-white" : "bg-white text-neutral-700 hover:bg-neutral-100"}`}
            >
              {t}
            </button>
          ))}
        </div>
      ),
      visual: (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 max-w-xl w-full font-mono text-sm text-neutral-800 break-all">
          {DOMAIN} {addressType} → {findRecord(DOMAIN, addressType)?.value}
        </div>
      ),
      resetAction: () => setAddressType("A"),
    },
    {
      section: "7. Record Types",
      title: "An alias: CNAME",
      body: (
        <div className="space-y-2">
          <p>
            A <Term id="cname-record">CNAME record</Term> doesn&rsquo;t give an address at all —
            it says &ldquo;this name is really just an alias, go resolve that other name
            instead.&rdquo;
          </p>
          <p>
            This is exactly the kind of detour that could happen partway through the chain you
            walked in Section 4: right when the authoritative server answers, instead of an
            address it hands back another name to start over with.
          </p>
          <p>
            Click through resolving{" "}
            <span className="font-mono text-neutral-800">{CNAME_DOMAIN}</span> and watch it
            happen.
          </p>
        </div>
      ),
      controls: (
        <button
          type="button"
          onClick={cnameVisited === 0 ? startCname : nextCnameHop}
          disabled={cnameResolved}
          className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark disabled:opacity-40 text-sm font-medium text-white"
        >
          {cnameVisited === 0
            ? "Resolve"
            : cnameResolved
              ? "Resolved"
              : `Follow to: ${cnameChain.chain[cnameVisited]}`}
        </button>
      ),
      visual: (
        <DnsLookupChain
          path={cnameChain.chain}
          visitedCount={cnameVisited}
          resolved={cnameResolved}
          answer={cnameChain.ip}
          showLegLabels={false}
        />
      ),
      resetAction: () => {
        setCnameVisited(0);
        setCnameResolved(false);
      },
    },
    {
      section: "7. Record Types",
      title: "MX: where mail goes",
      body: (
        <p>
          An <Term id="mx-record">MX record</Term> tells mail servers — not browsers — where
          email for a domain should be delivered. It&rsquo;s a completely separate lookup from
          the one your browser makes to load a page.
        </p>
      ),
      visual: (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 max-w-xl w-full font-mono text-sm text-neutral-800">
          {DOMAIN} MX → {findRecord(DOMAIN, "MX")?.value}
        </div>
      ),
    },
    {
      section: "7. Record Types",
      title: "A quick note on TXT, NS, and SOA",
      body: (
        <div className="space-y-2">
          <p>A few more record types exist without needing a deep dive:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="font-mono text-neutral-800">TXT</span> just holds arbitrary text,
              often used to prove ownership of a domain or to publish email anti-spoofing rules
              (SPF/DKIM).
            </li>
            <li>
              <span className="font-mono text-neutral-800">NS</span> records are the delegation
              pointers from the previous section.
            </li>
            <li>
              <span className="font-mono text-neutral-800">SOA</span> holds a zone&rsquo;s own
              bookkeeping — who manages it, and the default timers used when nothing else
              specifies one.
            </li>
          </ul>
        </div>
      ),
      visual: (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 max-w-xl w-full font-mono text-xs text-neutral-700 break-all">
          {DOMAIN} TXT → {findRecord(DOMAIN, "TXT")?.value}
        </div>
      ),
    },
    // ------------------ 8. Putting It All Together ---------------------
    {
      section: "8. Putting It All Together",
      title: "Walk the whole thing, start to finish",
      body: (
        <p>
          Every stage you&rsquo;ve met so far, back to back, for one real request. Click through
          it once, start to finish. (If the name didn&rsquo;t exist anywhere in the chain, you&rsquo;d
          get a definitive &ldquo;no such name&rdquo; instead of a referral — that&rsquo;s a whole
          different, final answer.)
        </p>
      ),
      controls: (
        <button
          type="button"
          onClick={nextPipelineStage}
          disabled={pipelineRevealed >= PIPELINE_STAGES.length}
          className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark disabled:opacity-40 text-sm font-medium text-white"
        >
          {pipelineRevealed >= PIPELINE_STAGES.length
            ? "Done"
            : pipelineRevealed === 0
              ? "Start"
              : `Next: ${PIPELINE_STAGES[pipelineRevealed].label}`}
        </button>
      ),
      visual: <FullPipelineRecap stages={PIPELINE_STAGES} revealedCount={pipelineRevealed} />,
      resetAction: () => setPipelineRevealed(0),
    },
    {
      section: "8. Putting It All Together",
      title: "Where DNS's job ends",
      body: (
        <p>
          The moment your device has that address, DNS is finished — everything after this
          (opening a connection to 93.184.216.34, encrypting it, sending an actual HTTP request)
          is a different system&rsquo;s job, covered in later chapters.
        </p>
      ),
      visual: undefined,
    },
    // ------------------------------ Wrap-up --------------------------
    {
      section: "Wrap-up",
      title: "Now it's your turn",
      body: (
        <div className="space-y-3">
          <p>Here&rsquo;s everything this chapter covered:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><Term id="dns">DNS</Term> is a distributed, hierarchical system mapping names to addresses — DNS only ever resolves the host part of a <Term id="url">URL</Term>.</li>
            <li>A domain name is a chain of delegated labels, read right to left.</li>
            <li>Before any network is involved, a local hosts file gets the first say.</li>
            <li>A <Term id="stub-resolver">stub resolver</Term> forwards to a <Term id="recursive-resolver">recursive resolver</Term> (its address usually handed out by <Term id="dhcp">DHCP</Term>), which does the real, iterative walk to root → TLD → authoritative.</li>
            <li>Caching skips that walk when a still-valid answer exists; a <Term id="ttl">TTL</Term> controls how long that&rsquo;s trusted — and the resolver&rsquo;s notebook is only one of several cache layers in practice.</li>
            <li>A <Term id="registrar">registrar</Term> (who you bought the name from) and a DNS host (who actually answers for it, e.g. Route 53) are often different companies, connected by an NS record.</li>
            <li>Beyond <Term id="a-record">A</Term>/<Term id="aaaa-record">AAAA</Term> records, a <Term id="cname-record">CNAME</Term> restarts the lookup under a different name, and an <Term id="mx-record">MX</Term> record routes email, not web traffic.</li>
          </ul>
          <p>
            A free-play version of this lookup is now unlocked below — pick a domain and record
            type, watch the cache work, and advance time yourself.
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
