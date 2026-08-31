export interface PipelineStage {
  label: string;
  detail: string;
}

/** Every stage this chapter covered, walked through once as a single
 * connected checklist instead of separate demos — the "start to finish,
 * no gaps" recap. Pure function of props; the caller (the Walkthrough)
 * owns how many stages are revealed so far. */
export function FullPipelineRecap({
  stages,
  revealedCount,
}: {
  stages: PipelineStage[];
  revealedCount: number;
}) {
  return (
    <div className="w-full max-w-xl rounded-lg border border-neutral-200 bg-white p-4">
      <ol className="space-y-2">
        {stages.map((stage, i) => {
          const revealed = i < revealedCount;
          const current = i === revealedCount - 1;
          return (
            <li key={stage.label} className="flex items-start gap-2.5">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  revealed ? "bg-cyan-600 text-white" : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {revealed ? "✓" : i + 1}
              </span>
              <div>
                <div className={`text-sm ${revealed ? "text-neutral-900 font-medium" : "text-neutral-400"}`}>
                  {stage.label}
                </div>
                {revealed && (
                  <div className={`text-xs ${current ? "text-cyan-700" : "text-neutral-500"}`}>{stage.detail}</div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
