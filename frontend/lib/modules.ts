export type ModuleId = "beginner" | "intermediate" | "upper-intermediate" | "advanced";

export interface ModuleInfo {
  id: ModuleId;
  slug: string;
  label: string;
  tagline: string;
  lifecycleStage: string;
}

/** Global nav order, mirroring docs/plan.md's four levels. */
export const MODULES: ModuleInfo[] = [
  {
    id: "beginner",
    slug: "beginner",
    label: "Beginner",
    tagline: "Everyday questions about how devices \"connect\"",
    lifecycleStage: "Getting Connected",
  },
  {
    id: "intermediate",
    slug: "intermediate",
    label: "Intermediate",
    tagline: "How data reaches you correctly",
    lifecycleStage: "Reliable Delivery",
  },
  {
    id: "upper-intermediate",
    slug: "upper-intermediate",
    label: "Upper Intermediate",
    tagline: "Keeping traffic safe and fast",
    lifecycleStage: "Security & Speed",
  },
  {
    id: "advanced",
    slug: "advanced",
    label: "Advanced",
    tagline: "Controlling traffic at scale",
    lifecycleStage: "Traffic Control",
  },
];

export function getModule(id: ModuleId): ModuleInfo {
  const found = MODULES.find((m) => m.id === id);
  if (!found) throw new Error(`Unknown module: ${id}`);
  return found;
}
