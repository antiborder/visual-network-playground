import { Fragment } from "react";

export type NetworkLayer = "house" | "isp" | "internet";

const LAYERS: { id: NetworkLayer; label: string; sublabel: string }[] = [
  { id: "house", label: "House LAN", sublabel: "192.168.1.0/24" },
  { id: "isp", label: "ISP network", sublabel: "100.64.0.0/10" },
  { id: "internet", label: "The internet", sublabel: "" },
];

/** The three nested networks a packet crosses on its way out to the public
 * internet — a household's own LAN, the ISP's shared carrier-grade network
 * (CGNAT), and the internet itself. `activeLayer` highlights where the
 * packet currently is and shows its address at that layer, so the same
 * diagram can be reused across several steps to track its journey. */
export function GatewayLayers({
  activeLayer,
  packetAddress,
}: {
  activeLayer: NetworkLayer;
  packetAddress: string;
}) {
  return (
    <div className="w-full max-w-xl rounded-lg border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-center gap-1.5">
        {LAYERS.map((layer, i) => {
          const isActive = layer.id === activeLayer;
          return (
            <Fragment key={layer.id}>
              <div
                className={`min-w-[100px] flex-1 rounded-md border px-2 py-3 text-center ${
                  isActive ? "border-cyan-400 bg-cyan-50" : "border-neutral-200 bg-neutral-50"
                }`}
              >
                <div className={`text-sm font-medium ${isActive ? "text-cyan-800" : "text-neutral-500"}`}>
                  {layer.label}
                </div>
                {layer.sublabel && (
                  <div className="mt-0.5 font-mono text-xs text-neutral-400">{layer.sublabel}</div>
                )}
                {isActive && (
                  <div className="mt-1 font-mono text-xs font-medium text-cyan-700">{packetAddress}</div>
                )}
              </div>
              {i < LAYERS.length - 1 && <span className="text-neutral-400">→</span>}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
