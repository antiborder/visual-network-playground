const SUBNET_PREFIX = "192.168.1.";

type Region = "network" | "host" | "broadcast";

const ACTIVE_COLOR: Record<Region, string> = {
  network: "bg-amber-100 border-amber-300 text-amber-800",
  host: "bg-emerald-100 border-emerald-300 text-emerald-800",
  broadcast: "bg-violet-100 border-violet-300 text-violet-800",
};

const MUTED_COLOR = "bg-neutral-50 border-neutral-200 text-neutral-400";

const CAPTION_COLOR: Record<Region, string> = {
  network: "text-amber-700",
  host: "text-emerald-700",
  broadcast: "text-violet-700",
};

const CAPTION_MUTED = "text-neutral-400";

/** A fixed, concrete address block used purely to define "network address",
 * "host address", and "broadcast address" before the interactive
 * SubnetExplorer combines those ideas with the mask slider. Not driven by
 * chapter state on purpose — this step is definitional.
 *
 * When `emphasize` is set, only that region's boxes/caption keep their
 * color — the other two mute to gray, so a single step can point at just
 * one idea while still showing it in the full block for context. */
export function AddressRangeStrip({
  start,
  end,
  emphasize,
}: {
  start: number;
  end: number;
  emphasize?: Region;
}) {
  const octets = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const regionFor = (i: number): Region =>
    i === 0 ? "network" : i === octets.length - 1 ? "broadcast" : "host";

  const captionClass = (region: Region) =>
    emphasize && emphasize !== region ? CAPTION_MUTED : CAPTION_COLOR[region];

  return (
    <div className="w-full max-w-xl space-y-2 rounded-lg border border-neutral-200 bg-white p-4">
      <div className="text-xs text-neutral-500">
        An 8-address block: {SUBNET_PREFIX}
        {start}&ndash;{end}
      </div>
      <div className="flex gap-1">
        {octets.map((o, i) => {
          const region = regionFor(i);
          const color = emphasize && emphasize !== region ? MUTED_COLOR : ACTIVE_COLOR[region];
          return (
            <div
              key={o}
              className={`flex-1 rounded border py-2 text-center font-mono text-xs font-medium ${color}`}
            >
              .{o}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between gap-2 text-xs leading-tight">
        <span className={`font-medium ${captionClass("network")}`}>
          network address
          <br />
          (names the subnet)
        </span>
        <span className={`font-medium text-center ${captionClass("host")}`}>
          host addresses
          <br />
          (assignable to devices)
        </span>
        <span className={`font-medium text-right ${captionClass("broadcast")}`}>
          broadcast address
          <br />
          (reaches everyone)
        </span>
      </div>
    </div>
  );
}
