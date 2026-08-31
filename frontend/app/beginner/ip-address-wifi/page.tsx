import { Breadcrumbs } from "@/components/Breadcrumbs";
import { IpAddressWifiPlayground } from "@/features/beginner/ip-address-wifi/IpAddressWifiPlayground";

export const metadata = { title: "[old] IP Address & Wi-Fi Connection [to be deleted]" };

export default function IpAddressWifiPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Beginner", href: "/beginner" },
          { label: "[old] IP Address & Wi-Fi Connection [to be deleted]" },
        ]}
      />
      <h1 className="text-2xl font-semibold mb-1">[old] IP Address & Wi-Fi Connection [to be deleted]</h1>
      <p className="text-neutral-600 mb-6 max-w-2xl">
        Every device on a network needs its own address to be reachable — see what that address
        looks like, and what happens when two devices end up sharing one.
      </p>
      <IpAddressWifiPlayground />
    </div>
  );
}
