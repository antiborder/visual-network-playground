import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DraftBeginnerPlayground } from "@/features/beginner/ip-address-wifi/DraftBeginnerPlayground";

export const metadata = { title: "DRAFT: Pip's Network Story" };

export default function PipsNetworkStoryPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "Beginner", href: "/beginner" }, { label: "DRAFT: Pip's Network Story" }]} />
      <h1 className="text-2xl font-semibold mb-1">DRAFT: Pip&rsquo;s Network Story</h1>
      <p className="text-neutral-600 mb-6 max-w-2xl">
        The redesigned Beginner track, told as one continuous story following Pip the mouse&rsquo;s
        cheese photo — eventually replaces the units below.
      </p>
      <DraftBeginnerPlayground />
    </div>
  );
}
