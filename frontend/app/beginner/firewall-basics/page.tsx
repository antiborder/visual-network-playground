import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FirewallLab } from "@/features/beginner/firewall-basics/FirewallLab";

export const metadata = { title: "Firewall Basics" };

export default function FirewallBasicsPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "Beginner", href: "/beginner" }, { label: "Firewall Basics" }]} />
      <h1 className="text-2xl font-semibold mb-1">Firewall Basics</h1>
      <p className="text-neutral-600 mb-6 max-w-2xl">
        How a firewall decides what gets in and out — rule order, default policy, and why a
        reply doesn&rsquo;t need its own explicit rule.
      </p>
      <FirewallLab />
    </div>
  );
}
