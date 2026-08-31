import type { ReactNode } from "react";
import type { GLOSSARY } from "@/lib/glossary";

/** Marks a word as a defined term without doing anything with it yet — the
 * Glossary popup this used to open has been retired. `id` stays required
 * on every call site (and still has to name a real glossary entry) so a
 * future pass can wire each term straight to the step that explains it
 * most fully, instead of a tooltip. Until then, this is a plain
 * pass-through: no click behavior, no popup, just the term's own text. */
export function Term({ children }: { id: keyof typeof GLOSSARY; children: ReactNode }) {
  return <>{children}</>;
}
