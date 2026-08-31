import Link from "next/link";
import { MODULES } from "@/lib/modules";
import { APP_NAME } from "@/lib/brand";

export default function Home() {
  return (
    <div>
      <div className="max-w-2xl mb-12">
        <h1 className="text-3xl font-semibold mb-3">{APP_NAME}</h1>
        <p className="text-neutral-600">
          Learn how networks actually work, one small idea at a time. Every chapter is an
          interactive walkthrough — drag an address, send a message, cause a conflict on purpose —
          followed by a free-play sandbox once you&rsquo;ve finished it.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {MODULES.map((module) => (
          <Link
            key={module.id}
            href={`/${module.slug}`}
            className="rounded-lg border border-neutral-200 bg-white p-4 hover:border-neutral-400 transition-colors"
          >
            <div className="text-xs text-neutral-500 mb-1">{module.lifecycleStage}</div>
            <div className="font-medium text-neutral-900">{module.label}</div>
            <p className="text-sm text-neutral-600 mt-1">{module.tagline}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
