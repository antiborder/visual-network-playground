function parseUrl(url: string) {
  const m = url.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):\/\/([^:/?#]+)(?::(\d+))?(\/[^?#]*)?(?:\?([^#]*))?/);
  if (!m) return null;
  return { scheme: m[1], host: m[2], port: m[3], path: m[4] ?? "", query: m[5] };
}

const PARTS: { key: "scheme" | "host" | "port" | "path" | "query"; color: string; label: string }[] = [
  { key: "scheme", color: "text-neutral-400", label: "scheme" },
  { key: "host", color: "text-cyan-700 font-semibold", label: "host (this is what DNS resolves)" },
  { key: "port", color: "text-amber-600", label: "port" },
  { key: "path", color: "text-emerald-600", label: "path" },
  { key: "query", color: "text-violet-600", label: "query" },
];

/** Breaks a URL into scheme/host/port/path/query and highlights the one
 * part — the host — that DNS is actually responsible for. Pure function of
 * props; no interactivity of its own. */
export function UrlAnatomy({ url }: { url: string }) {
  const parsed = parseUrl(url);
  if (!parsed) return null;

  return (
    <div className="w-full max-w-xl rounded-lg border border-neutral-200 bg-white p-4 space-y-3">
      <div className="font-mono text-base break-all">
        <span className="text-neutral-400">{parsed.scheme}://</span>
        <span className="text-cyan-700 font-semibold bg-cyan-50 rounded px-0.5">{parsed.host}</span>
        {parsed.port && <span className="text-amber-600">:{parsed.port}</span>}
        {parsed.path && <span className="text-emerald-600">{parsed.path}</span>}
        {parsed.query && <span className="text-violet-600">?{parsed.query}</span>}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {PARTS.filter((p) => parsed[p.key]).map((p) => (
          <span key={p.key} className={p.color}>
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}
