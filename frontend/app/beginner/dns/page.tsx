import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DnsLab } from "@/features/beginner/dns/DnsLab";

export const metadata = { title: "DNS" };

export default function DnsPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "Beginner", href: "/beginner" }, { label: "DNS" }]} />
      <h1 className="text-2xl font-semibold mb-1">DNS</h1>
      <p className="text-neutral-600 mb-6 max-w-2xl">
        Why typing a name instead of a number works — and what actually happens, server to
        server, between typing it and getting an answer.
      </p>
      <DnsLab />
    </div>
  );
}
