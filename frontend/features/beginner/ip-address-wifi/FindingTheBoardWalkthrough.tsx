"use client";

import { useState, type ReactNode } from "react";
import { Term } from "@/components/Term";
import { SegmentedProgressBar } from "@/components/SegmentedProgressBar";
import { StoryText } from "@/components/StoryText";
import { UrlAnatomy } from "../dns/UrlAnatomy";
import { DomainHierarchy } from "../dns/DomainHierarchy";
import { ResolverRoles } from "../dns/ResolverRoles";
import { RecursiveVsIterative } from "../dns/RecursiveVsIterative";
import {
  SceneOpeningBookmark,
  SceneUrlPieces,
  SceneRightToLeft,
  SceneNameVsNumber,
  SceneStubResolver,
  SceneNobodyHomeYet,
  SceneWhoToAskFirst,
  SceneOneQuestionOneAnswer,
  SceneStartingFromTop,
  SceneDeadEnd,
  SceneTwoCounters,
  SceneRecordBook,
  SceneWritingItDown,
  SceneHowLongToRemember,
  SceneHandingOff,
} from "./StorybookScenes";

const RECORD_ROWS = [
  { id: "a-record" as const, label: "A", detail: "Name → IPv4 address — the very kind Pip got" },
  { id: "aaaa-record" as const, label: "AAAA", detail: "Name → IPv6 address" },
  { id: "cname-record" as const, label: "CNAME", detail: "Alias for another name" },
  { id: "mx-record" as const, label: "MX", detail: "Where email should go" },
  { id: "txt-record" as const, label: "TXT", detail: "Ownership proof, anti-spam rules" },
  {
    id: "ns-record" as const,
    label: "NS",
    detail: "Who's authoritative for this name — the 'ask this one instead' note from before",
  },
  { id: "soa-record" as const, label: "SOA", detail: "The zone's own admin details" },
];

/** New Chapter 2 "Finding the Board" from the beginner story-based redesign
 * (see docs/beginner-story-redesign.md). Picks up the instant "Meet the
 * Network" leaves off: Pip finally opening "cheeselovers.com". Written as
 * one continuous chapter, covering the whole DNS journey — URL anatomy,
 * domain hierarchy, stub/recursive resolvers, the root→TLD→authoritative
 * walk, NXDOMAIN, registrar vs. hosting, record types, caching and TTL —
 * ending the moment Pip's phone finally holds a real IP address
 * (203.0.113.50) and hands off to the next chapter's journey out of the
 * house. Reuses the existing (non-story) DNS chapter's pure diagram
 * components (UrlAnatomy, DomainHierarchy, ResolverRoles,
 * RecursiveVsIterative) wherever they're already domain-agnostic. */
export function FindingTheBoardWalkthrough({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  // --- "How Long to Remember" TTL tradeoff sandbox ---
  const [ttlChoice, setTtlChoice] = useState<"short" | "long">("short");

  interface Step {
    section: string;
    title: string;
    story?: { text: string; illustration: ReactNode };
    body: ReactNode;
    visual?: ReactNode;
    controls?: ReactNode;
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
            Pip finally goes to post his photo — but opening a name on his phone is a long way
            from actually reaching a computer somewhere else. This chapter follows exactly what
            happens in between.
          </p>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>A Name Instead of a Number</li>
            <li>Asking Around</li>
            <li>Remembering the Answer</li>
          </ol>
        </div>
      ),
    },
    {
      section: "Welcome",
      title: "The chapter at a glance",
      body: (
        <p>
          In short: Pip&rsquo;s phone doesn&rsquo;t actually know where &ldquo;cheeselovers.com&rdquo;
          lives — it asks a resolver, which walks a whole chain of other servers, until someone
          finally hands back a real number.
        </p>
      ),
      visual: <ResolverRoles domain="cheeselovers.com" />,
    },
    // ---------------------------- The story ---------------------------
    {
      section: "1. A Name Instead of a Number",
      title: "Straight to the Board",
      story: {
        text: "Photo saved, Pip taps the Cheese-Lovers' Board bookmark.\nThe page opens straight up: 'cheeselovers.com' sits plainly in the address bar, letters and dots, nothing that looks like a number at all.\nPip: \"Huh, come to think of it — my own phone's address was a bunch of numbers. But this one's all letters.\"\nDad, still nearby, glances over his shoulder.\nDad: \"Ah, that's because a name like that still has to turn into a number eventually, somewhere under the hood.\"\nPip: \"Wait, really? I thought I was just... going to the website.\"\nDad: \"You are. But every device out there only knows how to find another device by its IP address — not by a name like that.\"",
        illustration: <SceneOpeningBookmark />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Every device on the internet only knows how to find another device by its{" "}
            <Term id="ip-address">IP address</Term> — a name like &ldquo;cheeselovers.com&rdquo;
            means nothing to them directly.
          </p>
          <p>
            <Term id="dns">DNS</Term> — short for Domain Name System — is the system that
            quietly turns a name like that into the real number behind it, every time, without
            anyone having to think about it.
          </p>
        </div>
      ),
      visual: (
        <div className="w-full max-w-xl rounded-lg border border-neutral-200 bg-white p-4 flex items-center justify-center gap-3 text-sm flex-wrap">
          <span className="font-mono text-neutral-800">cheeselovers.com</span>
          <span className="text-neutral-400">→</span>
          <span className="rounded-md bg-cyan-50 px-2 py-1 text-cyan-800 font-medium">DNS</span>
          <span className="text-neutral-400">→</span>
          <span className="font-mono text-neutral-800">203.0.113.50</span>
        </div>
      ),
    },
    {
      section: "1. A Name Instead of a Number",
      title: "More Than Just a Name",
      story: {
        text: "Pip taps 'Upload a Photo,' and a new page slides into view.\nPip: \"Huh, the address bar changed — it says 'cheeselovers.com/upload' now.\"\nPip: \"But wait, 'cheeselovers.com' is still sitting right there at the front, same as before.\"\nDad: \"Right — that whole thing is called a URL. The address stays put; only the page after it changes.\"\nPip: \"So which part actually turns into the number?\"\nDad: \"Just that first piece — 'cheeselovers.com.' The '/upload' part only matters once you've actually arrived.\"",
        illustration: <SceneUrlPieces />,
      },
      body: (
        <div className="space-y-2">
          <p>
            That whole thing Pip is looking at is a <Term id="url">URL</Term>: a scheme, a host,
            and a path, each doing a different job.
          </p>
          <p>
            DNS only ever resolves the host part — everything after it (like{" "}
            <span className="font-mono text-neutral-800">/upload</span>) only matters once a
            connection to that host already exists.
          </p>
        </div>
      ),
      visual: <UrlAnatomy url="https://cheeselovers.com/upload" />,
    },
    {
      section: "1. A Name Instead of a Number",
      title: "Right to Left",
      story: {
        text: "Pip stares at the two halves of the name, split by that single dot.\nPip: \"'Cheeselovers' and 'com' — why split it like that?\"\nDad: \"Think of '.com' as a huge district, and 'cheeselovers' as one specific address inside it. But even '.com' isn't at the very top — there's one shared starting point above every district in the world.\"\nPip: \"So reading it out loud goes specific-to-broad, but figuring out who's really in charge goes the other way?\"\nDad: \"Exactly — right to left. That starting point hands things down to the district, and the district hands it down to the address.\"",
        illustration: <SceneRightToLeft />,
      },
      body: (
        <p>
          A domain name is a chain of dot-separated labels, and authority flows right to left: an
          invisible <Term id="root-server">root</Term> delegates{" "}
          <span className="font-mono text-neutral-800">.com</span> to its own top-level authority,
          which then delegates{" "}
          <span className="font-mono text-neutral-800">cheeselovers</span> to whoever registered
          it.
        </p>
      ),
      visual: <DomainHierarchy domain="cheeselovers.com" />,
    },
    {
      section: "1. A Name Instead of a Number",
      title: "Why Not Just Use the Number?",
      story: {
        text: "Pip: \"Okay, but why bother with a name at all? Why not just type the number straight away?\"\nDad: \"You could, if you memorized it. But two things: numbers are hard to remember, and—\"\nPip: \"And?\"\nDad: \"And that number can actually change over time, if the website ever moves to a new computer. The name can stay exactly the same either way.\"",
        illustration: <SceneNameVsNumber />,
      },
      body: (
        <p>
          Names are simply easier to remember than a string of digits — but there&rsquo;s a
          second reason too: the IP address behind a name can change (the site moving to a new
          server, say), while the name itself never has to.
        </p>
      ),
      visual: (
        <div className="w-full max-w-xl grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 text-center space-y-1">
            <div className="text-xs text-neutral-500">Name</div>
            <div className="font-mono text-sm text-neutral-800">cheeselovers.com</div>
            <div className="text-xs text-neutral-500">Stays the same</div>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-4 text-center space-y-1">
            <div className="text-xs text-neutral-500">Address</div>
            <div className="font-mono text-sm text-neutral-800">203.0.113.50</div>
            <div className="text-xs text-neutral-500">Can change over time</div>
          </div>
        </div>
      ),
    },
    {
      section: "2. Asking Around",
      title: "A Stand-In, Not a Stranger",
      story: {
        text: "Pip: \"Okay, so who actually knows the number, then?\"\nDad: \"There's a small piece of software already built right into your phone — it's called a stub resolver.\"\nPip: \"Stub? That's a weird word.\"\nDad: \"It just means 'stand-in.' Most of the time it can't answer on its own — it just passes your question along to someone who can.\"\nPip: \"So it's basically a middleman?\"\nDad: \"Most of the time, yes. But every so often, it doesn't have to ask anyone at all — it can answer for itself.\"",
        illustration: <SceneStubResolver />,
      },
      body: (
        <div className="space-y-2">
          <p>
            That small piece of software living inside Pip&rsquo;s phone is called a{" "}
            <Term id="stub-resolver">stub resolver</Term>. &ldquo;Stub&rdquo; here means a
            stand-in, or a substitute.
          </p>
          <p>
            Most of the time, it can&rsquo;t answer a DNS question on its own — it just forwards
            the question to a real <Term id="recursive-resolver">recursive resolver</Term> and
            relays back whatever answer comes home. But sometimes it can stand in for that
            recursive resolver completely, and answer immediately, all by itself.
          </p>
        </div>
      ),
      visual: (
        <div className="w-full max-w-xl grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 text-center space-y-1">
            <div className="text-sm font-medium text-neutral-800">Usually</div>
            <div className="text-xs text-neutral-500">Forwards the question to the recursive resolver</div>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-4 text-center space-y-1">
            <div className="text-sm font-medium text-neutral-800">Sometimes</div>
            <div className="text-xs text-neutral-500">Answers immediately, standing in for it</div>
          </div>
        </div>
      ),
    },
    {
      section: "2. Asking Around",
      title: "Have We Been Here Before?",
      story: {
        text: "Pip: \"Wait, how could it possibly answer without asking anyone?\"\nDad: \"If you'd visited cheeselovers.com recently, your phone might still remember the answer from last time. That's called a cache.\"\nPip: \"So it just... remembers?\"\nDad: \"Exactly — and when it does, your stub resolver is standing in for the recursive resolver completely. No need to ask it anything at all.\"\nPip: \"Oh, that's what 'stand-in' meant!\"\nDad: \"Exactly. But this is the very first time you've ever opened cheeselovers.com.\"\nPip's phone quietly checks its cache and comes up empty.\nPip: \"So it really doesn't know?\"\nDad: \"Not this time. Now it actually has to go ask.\"",
        illustration: <SceneNobodyHomeYet />,
      },
      body: (
        <div className="space-y-2">
          <p>
            A <Term id="cache">cache</Term> is a short memory of answers already looked up
            before, kept so the same question never has to be answered the hard way twice.
          </p>
          <p>
            That&rsquo;s exactly what would let the stub resolver stand in for the recursive
            resolver: if the answer were already sitting in its cache, it could hand it straight
            back — no recursive resolver, no internet, no waiting.
          </p>
          <p>
            But since &ldquo;cheeselovers.com&rdquo; has never come up on this phone before, that
            cache comes back empty — so this time, the question really does have to go somewhere
            else.
          </p>
        </div>
      ),
      visual: (
        <div className="w-full max-w-xl rounded-lg border border-neutral-200 bg-white p-3 font-mono text-sm text-neutral-700">
          lookup(&ldquo;cheeselovers.com&rdquo;) → <span className="text-neutral-400">not cached</span>
        </div>
      ),
    },
    {
      section: "2. Asking Around",
      title: "Who Do You Ask First?",
      story: {
        text: "Dad: \"There's also its hosts file to check — a short list of names it's been told to remember by hand. Yours is empty, so no shortcuts there either.\"\nPip: \"Okay, so then who?\"\nDad: \"The same router that gave your phone its own number also hands it the address of a recursive resolver — bundled in together, without you ever having to ask. That resolver's really good at finding names like this.\"",
        illustration: <SceneWhoToAskFirst />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Separately from that cache, there&rsquo;s one more local check: the{" "}
            <Term id="hosts-file">hosts file</Term>, a short list of overrides someone writes in
            by hand. It has nothing to do with past lookups — it&rsquo;s empty simply because
            nobody ever added an entry for cheeselovers.com.
          </p>
          <p>
            From there it turns to its <Term id="recursive-resolver">recursive resolver</Term>,
            whose address it already knows — handed out automatically by{" "}
            <Term id="dhcp">DHCP</Term>, right alongside its own IP address.
          </p>
        </div>
      ),
      visual: (
        <div className="w-full max-w-xl rounded-lg border border-neutral-200 bg-white p-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">1.</span>
            <span className="text-neutral-700">Check the hosts file</span>
            <span className="ml-auto text-neutral-400 text-xs">empty</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">2.</span>
            <span className="text-neutral-700">Ask the recursive resolver</span>
            <span className="ml-auto text-cyan-700 text-xs font-mono">already known</span>
          </div>
        </div>
      ),
    },
    {
      section: "2. Asking Around",
      title: "One Question, One Answer",
      story: {
        text: "Pip: \"So my phone asks this recursive resolver, and that's it?\"\nDad: \"That's it, from your phone's side. It asks one question, and waits for exactly one answer — it doesn't want to do any of the legwork itself.\"\nPip: \"So the resolver does all the digging?\"\nDad: \"All of it. Your phone just waits.\"",
        illustration: <SceneOneQuestionOneAnswer />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Pip&rsquo;s phone only ever talks to one machine: its{" "}
            <Term id="recursive-resolver">recursive resolver</Term>. This isn&rsquo;t a box in the
            house — it&rsquo;s a separate server out on the internet, usually run by an internet
            provider, or a public service like 8.8.8.8 or 1.1.1.1.
          </p>
          <p>
            The phone asks that one question and waits for exactly one answer. Everything past
            that point — however many other servers get involved — is work the resolver does on
            its own, not a second hop the phone itself makes.
          </p>
        </div>
      ),
      visual: <ResolverRoles domain="cheeselovers.com" />,
    },
    {
      section: "2. Asking Around",
      title: "Starting From the Top",
      story: {
        text: "Pip: \"But if the recursive resolver doesn't know either, then what?\"\nDad: \"Then it goes and asks around at a whole chain of counters — each one's only job is answering 'what's the IP address for this name?', nothing else.\"\nPip: \"So it can just ask any one of them?\"\nDad: \"Not quite. The first counter doesn't know 'cheeselovers.com' at all — it only knows which counter handles endings like '.com.' That '.com' counter, in turn, knows exactly which counter is responsible for 'cheeselovers.com' itself. That's the one with the real answer.\"\nPip: \"That 'here, ask this one instead' note — does that have a name too?\"\nDad: \"It does — it's called an NS record. Every counter that isn't the last one hands over exactly one of those.\"",
        illustration: <SceneStartingFromTop />,
      },
      body: (
        <div className="space-y-2">
          <p>
            That single ask-and-wait is called a <strong>recursive</strong> question — not
            because the phone repeats anything, but because of what it demands from the
            resolver: keep going, however many other servers it takes, until you have the real
            answer.
          </p>
          <p>
            Answering it is what actually takes the repeating: the resolver&rsquo;s own walk is{" "}
            <strong>iterative</strong>, one hop at a time.
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>
              <Term id="root-server">Root</Term> — only knows who handles each ending
            </li>
            <li>TLD server — the one responsible for endings like &ldquo;.com&rdquo;</li>
            <li>
              <Term id="authoritative-dns">Authoritative server</Term> — has the real answer for
              cheeselovers.com itself
            </li>
          </ol>
          <p>
            Every referral along that walk is written down as an{" "}
            <Term id="ns-record">NS record</Term> — the entry that says which server is
            responsible for a name, one level down. For cheeselovers.com, that looks like:
          </p>
        </div>
      ),
      visual: (
        <div className="space-y-3">
          <RecursiveVsIterative domain="cheeselovers.com" />
          <div className="w-full max-w-xl overflow-x-auto rounded-lg border border-neutral-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                  <th className="p-2 font-medium">Found at</th>
                  <th className="p-2 font-medium">NS record says</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                <tr className="border-b border-neutral-100">
                  <td className="p-2 text-neutral-500">Root</td>
                  <td className="p-2 font-mono text-xs">.com → the .com registry&rsquo;s own servers</td>
                </tr>
                <tr>
                  <td className="p-2 text-neutral-500">.com registry</td>
                  <td className="p-2 font-mono text-xs">cheeselovers.com → ns1.cheeselovers-host.example</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      section: "2. Asking Around",
      title: "Dead End",
      story: {
        text: "Pip: \"What happens if I typed it wrong, though? Like 'cheeselovrs.com'?\"\nDad: \"Good question. The resolver would visit the exact same counters — the top one, then the '.com' one — but that very last counter would come up empty.\"\nPip: \"So it just... says no?\"\nDad: \"Exactly. A clear 'no such name exists' — not a maybe, not a timeout. Just, nothing's there.\"",
        illustration: <SceneDeadEnd />,
      },
      body: (
        <p>
          Reaching the authoritative server and finding nothing there produces a definite answer:{" "}
          <Term id="nxdomain">NXDOMAIN</Term> — no such name exists. Not a timeout, not a maybe.
        </p>
      ),
      visual: (
        <div className="w-full max-w-xl rounded-lg border border-red-200 bg-red-50 p-4 font-mono text-sm text-red-700">
          cheeselovrs.com → NXDOMAIN
        </div>
      ),
    },
    {
      section: "2. Asking Around",
      title: "Someone Else's Counter",
      story: {
        text: "The recursive resolver finally reaches the real counter for 'cheeselovers.com' — the very last stop.\nPip: \"So this counter is run by whoever owns cheeselovers.com?\"\nDad: \"Not necessarily! Whoever bought the name is one company. The team actually answering questions about it day to day is often a completely different one, hired just for that job.\"\nPip: \"Huh — so buying the name and running the counter are two separate jobs?\"\nDad: \"Exactly right.\"",
        illustration: <SceneTwoCounters />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Buying a domain name and answering questions about it are two separate jobs. A{" "}
            <Term id="registrar">registrar</Term> is who you buy the name from.
          </p>
          <p>
            The actual day-to-day answering is DNS hosting — often a completely different
            company, hired just for that.
          </p>
        </div>
      ),
      visual: (
        <div className="w-full max-w-xl grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 text-center space-y-1">
            <div className="text-sm font-medium text-neutral-800">Registrar</div>
            <div className="text-xs text-neutral-500">Sold cheeselovers.com to its owner</div>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-4 text-center space-y-1">
            <div className="text-sm font-medium text-neutral-800">DNS host</div>
            <div className="text-xs text-neutral-500">Answers lookups for it day to day</div>
          </div>
        </div>
      ),
    },
    {
      section: "3. Remembering the Answer",
      title: "Not the Only Kind of Entry",
      story: {
        text: "Pip: \"So this counter just has, what, one number written down?\"\nDad: \"For your question, yes — just the one. But its record book actually holds all kinds of entries: some for finding a website, others for delivering mail, proving who owns the name, and more.\"\nPip: \"So which kind was the one I got — 203.0.113.50?\"\nDad: \"That one's called an A record — a name pointing straight at a number, nothing else.\"\nPip: \"Wow, I didn't realize one little name could carry so much.\"\nDad: \"It's a whole book, not just one line.\"",
        illustration: <SceneRecordBook />,
      },
      body: (
        <div className="space-y-3">
          <p>
            The one Pip&rsquo;s phone just got, a name mapped straight to a number, is called an{" "}
            <Term id="a-record">A record</Term>. It&rsquo;s the simplest kind of entry: just a
            name and the address behind it, nothing else.
          </p>
          <div className="w-full max-w-xl overflow-x-auto rounded-lg border border-neutral-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                  <th className="p-2 font-medium">Name</th>
                  <th className="p-2 font-medium">Type</th>
                  <th className="p-2 font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                <tr>
                  <td className="p-2 font-mono text-xs">cheeselovers.com</td>
                  <td className="p-2 font-mono text-xs">
                    <Term id="a-record">A</Term>
                  </td>
                  <td className="p-2 font-mono text-xs">203.0.113.50</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            A record and <Term id="ns-record">NS record</Term> have both already come up in this
            chapter — but the authoritative server&rsquo;s record book actually holds several
            other kinds of entries too, each doing its own separate job:
          </p>
        </div>
      ),
      visual: (
        <div className="w-full max-w-xl overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                <th className="p-2 font-medium">Record</th>
                <th className="p-2 font-medium">What it&rsquo;s for</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700">
              {RECORD_ROWS.map((row, i) => (
                <tr key={row.id} className={i < RECORD_ROWS.length - 1 ? "border-b border-neutral-100" : ""}>
                  <td className="p-2 font-mono">
                    <Term id={row.id}>{row.label}</Term>
                  </td>
                  <td className="p-2">{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      section: "3. Remembering the Answer",
      title: "Writing It Down",
      story: {
        text: "The desk finally hands over a number: 203.0.113.50.\nPip: \"Finally! So now my phone remembers this forever?\"\nDad: \"For a while, yes. Your stub resolver jots it down, and so does the recursive resolver along the way — so next time, nobody has to walk all those stops again.\"\nPip: \"Smart. Saves everyone the trip.\"",
        illustration: <SceneWritingItDown />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Once an answer comes back, it gets written down — not just in Pip&rsquo;s own{" "}
            <Term id="stub-resolver">stub resolver</Term>, but at the recursive resolver too, and
            sometimes inside the browser and operating system along the way.
          </p>
          <p>
            Each of these is its own short-lived cache, there to skip the whole walk next time the
            same name comes up.
          </p>
        </div>
      ),
      visual: (
        <div className="w-full max-w-xl grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 text-center space-y-1">
            <div className="text-sm font-medium text-neutral-800">Pip&rsquo;s stub resolver</div>
            <div className="font-mono text-xs text-neutral-600">cheeselovers.com → 203.0.113.50</div>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-4 text-center space-y-1">
            <div className="text-sm font-medium text-neutral-800">Recursive resolver</div>
            <div className="font-mono text-xs text-neutral-600">cheeselovers.com → 203.0.113.50</div>
          </div>
        </div>
      ),
    },
    {
      section: "3. Remembering the Answer",
      title: "How Long to Remember",
      story: {
        text: "Pip: \"So it just remembers it forever, then?\"\nDad: \"Not forever — every entry comes with its own little expiration note. Once that runs out, everyone has to go ask all over again.\"\nPip: \"Why not just remember it forever, though?\"\nDad: \"Because the real number could change one day. A short memory catches that quickly; a long one risks handing out a stale answer.\"",
        illustration: <SceneHowLongToRemember />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Every cached answer carries its own <Term id="ttl">TTL</Term> — a countdown for how
            long it can be trusted before it must be looked up again. It&rsquo;s a straight
            tradeoff between freshness and speed. Try both below.
          </p>
        </div>
      ),
      controls: (
        <div className="flex flex-wrap gap-2">
          {(["short", "long"] as const).map((choice) => (
            <button
              key={choice}
              type="button"
              onClick={() => setTtlChoice(choice)}
              className={`px-3 py-1.5 rounded-md text-sm ${
                ttlChoice === choice
                  ? "bg-storybook-accent text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {choice === "short" ? "Short TTL" : "Long TTL"}
            </button>
          ))}
        </div>
      ),
      visual: (
        <div className="w-full max-w-xl rounded-lg border border-neutral-200 bg-white p-4 space-y-1">
          <div className="font-mono text-sm text-neutral-800">
            cheeselovers.com → 203.0.113.50{" "}
            <span className="text-neutral-400">(TTL: {ttlChoice === "short" ? "60s" : "24h"})</span>
          </div>
          <div className={`text-sm font-medium ${ttlChoice === "short" ? "text-emerald-600" : "text-amber-600"}`}>
            {ttlChoice === "short"
              ? "Fresher — but the resolver has to re-check almost every minute"
              : "Fewer lookups — but a change to the real address takes up to a day to show up"}
          </div>
        </div>
      ),
      resetAction: () => setTtlChoice("short"),
    },
    {
      section: "3. Remembering the Answer",
      title: "Handing Off",
      story: {
        text: "Pip: \"Okay! 203.0.113.50 — got it. So... that's it? We're there?\"\nDad: \"Almost. That counter was only ever an address book — it never actually held your photo or anyone else's. The real Cheese-Lovers' Board lives on a completely different computer, over at that very number.\"\nPip: \"Oh — so finding the number was the whole job here?\"\nDad: \"Exactly. What happens next — actually knocking on that number's door — is a different job entirely.\"\nPip taps the screen, photo ready, number in hand.\nPip: \"Alright. Let's go knock, then.\"",
        illustration: <SceneHandingOff />,
      },
      body: (
        <p>
          With 203.0.113.50 in hand, DNS&rsquo;s job is finished. Actually reaching that address —
          opening a connection, sending the photo — is a separate job the browser takes over from
          here.
        </p>
      ),
      visual: (
        <div className="w-full max-w-xl rounded-lg border border-neutral-200 bg-white p-4 flex items-center justify-center gap-3 text-sm flex-wrap">
          <span className="rounded-md bg-emerald-50 text-emerald-700 px-3 py-1.5 font-medium">
            Finding the address ✓
          </span>
          <span className="text-neutral-400">→</span>
          <span className="rounded-md bg-neutral-100 text-neutral-500 px-3 py-1.5">Actually connecting</span>
        </div>
      ),
    },
    // ------------------------------ Wrap-up --------------------------
    {
      section: "Wrap-up",
      title: "Now it's your turn",
      body: (
        <div className="space-y-3">
          <p>Here&rsquo;s everything this chapter covered:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              A <Term id="url">URL</Term> is more than a domain name; <Term id="dns">DNS</Term>{" "}
              only ever resolves the host part, turning a name into the{" "}
              <Term id="ip-address">IP address</Term> behind it.
            </li>
            <li>
              Domain names are read right to left for authority: an invisible root delegates each
              top-level domain downward, one label at a time.
            </li>
            <li>
              A device&rsquo;s <Term id="stub-resolver">stub resolver</Term> checks its own{" "}
              <Term id="hosts-file">hosts file</Term> first, then asks a{" "}
              <Term id="recursive-resolver">recursive resolver</Term> one recursive question —
              which itself walks root → TLD → <Term id="authoritative-dns">authoritative server</Term>{" "}
              iteratively, or comes back <Term id="nxdomain">NXDOMAIN</Term> if the name
              doesn&rsquo;t exist.
            </li>
            <li>
              A <Term id="registrar">registrar</Term> sells a name; a separate DNS host answers
              for it day to day, using several kinds of records (<Term id="a-record">A</Term>,{" "}
              <Term id="aaaa-record">AAAA</Term>, <Term id="cname-record">CNAME</Term>,{" "}
              <Term id="mx-record">MX</Term>, <Term id="txt-record">TXT</Term>,{" "}
              <Term id="ns-record">NS</Term>, <Term id="soa-record">SOA</Term>).
            </li>
            <li>
              Answers get cached at multiple layers, each with its own <Term id="ttl">TTL</Term> —
              trading freshness for speed.
            </li>
          </ul>
        </div>
      ),
    },
  ];

  const total = steps.length;
  const current = steps[step];
  const isLast = step === total - 1;
  const isFirst = step === 0;

  const goNext = () => {
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
        {current.story && (
          <div className="space-y-3 pb-4 mb-1 border-b border-storybook-ink/15">
            {current.story.illustration}
            <StoryText text={current.story.text} />
          </div>
        )}

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
