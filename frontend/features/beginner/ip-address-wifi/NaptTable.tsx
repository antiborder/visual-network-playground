export interface NaptRow {
  privateAddr: string;
  publicAddr: string;
}

/** The router's NAPT translation table: each row remembers which internal
 * address+port a public address+port stands in for, which is the only
 * reason a reply from the internet can find its way back to the right
 * device inside the LAN. */
export function NaptTable({ rows }: { rows: NaptRow[] }) {
  return (
    <div className="w-full max-w-xl overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
            <th className="p-2 font-medium">Inside the ISP network</th>
            <th className="p-2 font-medium"> </th>
            <th className="p-2 font-medium">On the public internet</th>
          </tr>
        </thead>
        <tbody className="text-neutral-700">
          {rows.map((row, i) => (
            <tr key={i} className={i < rows.length - 1 ? "border-b border-neutral-100" : ""}>
              <td className="p-2 font-mono text-xs">{row.privateAddr}</td>
              <td className="p-2 text-center text-neutral-400">⇄</td>
              <td className="p-2 font-mono text-xs">{row.publicAddr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
