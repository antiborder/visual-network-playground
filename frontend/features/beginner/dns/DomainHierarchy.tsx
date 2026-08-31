interface Level {
  name: string;
  caption: string;
}

function buildLevels(domain: string): Level[] {
  const labels = domain.split(".");
  const levels: Level[] = [{ name: ".", caption: "Root" }];
  for (let i = labels.length - 1; i >= 0; i--) {
    const name = labels.slice(i).join(".");
    const caption = i === labels.length - 1 ? "TLD" : i === 0 ? "Full domain name" : "Second-level domain";
    levels.push({ name, caption });
  }
  return levels;
}

/** A domain name read as a chain of delegations: the root hands off
 * authority for a TLD, which hands off authority for the next label, and
 * so on — read right-to-left in the name itself, but drawn here
 * left-to-right in the order authority actually flows. Pure function of
 * props. */
export function DomainHierarchy({ domain }: { domain: string }) {
  const levels = buildLevels(domain);

  return (
    <div className="w-full max-w-xl overflow-x-auto">
      <div className="flex items-center gap-2 w-max">
        {levels.map((level, i) => (
          <div key={level.name} className="flex items-center gap-2">
            {i > 0 && <span className="text-neutral-400">→</span>}
            <div className="rounded-lg border border-cyan-300 bg-cyan-50 px-3 py-2 text-center">
              <div className="font-mono text-sm text-cyan-800">{level.name}</div>
              <div className="text-xs text-neutral-500">{level.caption}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
