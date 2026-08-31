export interface GlossaryEntry {
  term: string;
  definition: string;
}

/** Plain-language definitions for jargon used across the chapters. Keyed by
 * a stable id so `<Term id="...">` call sites don't break if the display
 * text changes. Extend this as new chapters introduce new vocabulary. */
export const GLOSSARY: Record<string, GlossaryEntry> = {
  packet: {
    term: "Packet",
    definition:
      "A small chunk that a larger message (like a photo) gets chopped into before it's sent. Each packet carries its own addressing information and can travel independently, to be reassembled at the destination.",
  },
  "ip-address": {
    term: "IP address",
    definition:
      "A number every device on a network is given so other devices know where to send data to it — like a street address, but for a network. On a home network it usually looks like 192.168.1.10.",
  },
  lan: {
    term: "LAN (Local Area Network)",
    definition:
      "A small network confined to one place — a home, an office — where devices talk to each other directly, usually through one shared router.",
  },
  router: {
    term: "Router",
    definition:
      "The device that connects a LAN's devices to each other and to the wider internet, and hands out an IP address to each device that joins.",
  },
  modem: {
    term: "Modem",
    definition:
      "The device that connects a home network to the internet provider outside. It's separate from the router, whose job instead is spreading that one connection to every device inside the house.",
  },
  wifi: {
    term: "Wi-Fi",
    definition:
      "A way for devices to join a LAN over radio waves instead of a physical cable, so phones, laptops, and smart devices can connect without being plugged in.",
  },
  "wifi-band": {
    term: "Wi-Fi band",
    definition:
      "One of the radio frequency ranges Wi-Fi can use — commonly 2.4GHz and 5GHz. The lower 2.4GHz band travels farther and passes through walls better; the higher 5GHz band is faster up close but loses strength sooner over distance or through obstacles.",
  },
  interference: {
    term: "Interference",
    definition:
      "Anything that weakens a Wi-Fi signal as it travels — physical obstacles like walls and floors, plain distance, or other nearby devices using the same radio frequency.",
  },
  server: {
    term: "Server",
    definition:
      "A computer, often far away and always running, that stores data or provides a service other devices connect to — like the computer hosting a website's photos and posts.",
  },
  client: {
    term: "Client",
    definition:
      "A device that requests something from a server rather than providing it — a phone or PC acts as a client every time it loads a page or uploads a file.",
  },
  "ip-conflict": {
    term: "IP conflict",
    definition:
      "What happens when two devices on the same network are accidentally given the same IP address — the network can no longer tell which device a message is meant for, so communication to that address fails.",
  },
  "mac-address": {
    term: "MAC address",
    definition:
      "A fixed ID burned into a device's network hardware at the factory. Unlike an IP address, it never changes — it identifies the physical device itself, not its place on a particular network.",
  },
  "subnet-mask": {
    term: "Subnet mask",
    definition:
      "A rule that splits an IP address into a network part (shared by every device on the same subnet) and a host part (unique to one device within it). Written as a prefix length like /24.",
  },
  "private-ip": {
    term: "Private IP address",
    definition:
      "An address from a reserved range (like 192.168.x.x) that only has meaning inside its own local network. Every home network can reuse the same private addresses without conflict, because they're never routed on the open internet.",
  },
  "global-ip": {
    term: "Global IP address",
    definition:
      "An address that is unique across the entire internet, unlike a private address. A router translates between its network's private addresses and its one global address to reach the internet.",
  },
  dhcp: {
    term: "DHCP",
    definition:
      "Dynamic Host Configuration Protocol — the process a device uses to automatically request and receive an IP address from a router, instead of someone typing one in by hand.",
  },
  arp: {
    term: "ARP",
    definition:
      "Address Resolution Protocol — how a device finds the MAC address behind an IP address on its LAN, by broadcasting \"who has this address?\" and waiting for whoever holds it to reply.",
  },
  ipv6: {
    term: "IPv6",
    definition:
      "A newer, much longer address format designed to replace IPv4, whose roughly 4 billion possible addresses are no longer enough for the number of devices online. IPv6 addresses look like 2001:db8::1 and use hexadecimal instead of decimal.",
  },
  "default-gateway": {
    term: "Default gateway",
    definition:
      "The device a computer sends traffic to whenever the destination isn't inside its own subnet — usually the router. It's the one hop every outbound message outside the LAN passes through first.",
  },
  nat: {
    term: "NAT (Network Address Translation)",
    definition:
      "The process a router uses to rewrite a private address (and usually a port too, which is technically called NAPT) into its own public one — and remembers the mapping, so a reply knows exactly which internal device to come back to.",
  },
  cgnat: {
    term: "CGNAT (Carrier-Grade NAT)",
    definition:
      "The same address-translation trick a home router performs, done one layer further out by the ISP itself — sharing one pool of public addresses across many households, each already hidden behind its own router's NAT.",
  },
  dns: {
    term: "DNS",
    definition:
      "Domain Name System — the process that turns a name like example.com into the IP address needed to actually reach it, so people never have to remember or type raw numbers.",
  },
  "a-record": {
    term: "A record",
    definition:
      "The entry in a domain's DNS records that maps its name directly to an IPv4 address — the answer an ordinary lookup is trying to find.",
  },
  "authoritative-dns": {
    term: "Authoritative DNS server",
    definition:
      "The server that holds the actual, official records for a domain. Every other DNS server along the way is just forwarding the question until it reaches this one — or serving a cached copy of what it once answered.",
  },
  ttl: {
    term: "TTL (Time To Live)",
    definition:
      "How long a cached answer is allowed to be reused before it must be looked up again. A short TTL keeps answers fresh at the cost of more lookups; a long TTL is faster but risks handing out a stale answer.",
  },
  url: {
    term: "URL",
    definition:
      "The full address typed or clicked to reach something on the web — a scheme (like https://), a host, an optional port, a path, and an optional query. DNS only ever resolves the host part.",
  },
  "stub-resolver": {
    term: "Stub resolver",
    definition:
      "The small piece of software built into your device's operating system that handles DNS lookups on your behalf. \"Stub\" means stand-in: most of the time it can't answer on its own, so it just forwards the question to a recursive resolver — but if the answer is already sitting in its own cache, it can answer in the recursive resolver's place, with no forwarding needed.",
  },
  cache: {
    term: "Cache",
    definition:
      "A short memory of answers already looked up before, kept so the same question doesn't have to be answered the hard way again. Comes with an expiration (see TTL) so a stale answer doesn't stick around forever.",
  },
  "recursive-resolver": {
    term: "Recursive resolver",
    definition:
      "The server that does the actual legwork of a DNS lookup: querying the root, then a TLD server, then the authoritative server, one at a time, and handing your device back a single final answer. Often run by your ISP, or a public service like Google's 8.8.8.8 or Cloudflare's 1.1.1.1.",
  },
  "root-server": {
    term: "Root server",
    definition:
      "One of the small number of server systems (13 addresses, though each is replicated at many physical locations) that sit at the very top of the DNS hierarchy and know which servers are responsible for each top-level domain like .com or .jp.",
  },
  registrar: {
    term: "Registrar",
    definition:
      "The company you buy a domain name from. Owning the name and hosting its actual DNS records are two separate things — a registrar often isn't the same company as whoever's DNS hosting answers lookups for that domain.",
  },
  "cname-record": {
    term: "CNAME record",
    definition:
      "A record that says \"this name is really just an alias for that other name\" — resolving it means restarting the lookup for the name it points to, rather than returning an address directly.",
  },
  "aaaa-record": {
    term: "AAAA record",
    definition:
      "Like an A record, but mapping a name to an IPv6 address instead of an IPv4 one.",
  },
  "mx-record": {
    term: "MX record",
    definition:
      "The record that tells the rest of the internet which server should receive email for a domain — looked up by mail servers, not browsers.",
  },
  "ns-record": {
    term: "NS record",
    definition:
      "The record that names which servers are authoritative for a domain — it's how a TLD server points a lookup toward the right authoritative server in the first place.",
  },
  "txt-record": {
    term: "TXT record",
    definition:
      "A record that holds arbitrary text rather than an address — commonly used to prove ownership of a domain, or to publish anti-spam rules like SPF and DKIM for its email.",
  },
  "soa-record": {
    term: "SOA record",
    definition:
      "The record holding a domain's own administrative details — which server is its primary authority, an administrator contact, and timers controlling how its records get refreshed and retried.",
  },
  "hosts-file": {
    term: "Hosts file",
    definition:
      "A short, manually-edited list of name-to-address overrides stored right on a device. Checked before any DNS lookup happens — a name listed there never has to be looked up at all.",
  },
  nxdomain: {
    term: "NXDOMAIN",
    definition:
      "The definitive DNS answer meaning \"no such name exists\" — not a timeout or a maybe, but a certain no, returned once a query reaches the authoritative server and finds nothing there.",
  },
  http: {
    term: "HTTP",
    definition:
      "HyperText Transfer Protocol — the request/response format a browser and a web server use to talk to each other: the browser sends a request, the server sends back a response.",
  },
  stateless: {
    term: "Stateless",
    definition:
      "Each HTTP request is handled with no memory of any earlier one — the server doesn't automatically know two requests came from the same visitor unless something (like a cookie) tells it so.",
  },
  "bad-gateway": {
    term: "502 Bad Gateway",
    definition:
      "The server acting as a go-between (like a load balancer) reached the next server in line, but got back a response that wasn't valid HTTP at all — often because that next server has crashed or isn't listening.",
  },
  "gateway-timeout": {
    term: "504 Gateway Timeout",
    definition:
      "The go-between server never got a response in time from the next server in line — which itself might be waiting on something further behind it, like a slow database.",
  },
  firewall: {
    term: "Firewall",
    definition:
      "A checkpoint at the edge of a network that allows or blocks traffic based on rules — typically direction (in or out), IP address, and port number.",
  },
  "stateful-inspection": {
    term: "Stateful inspection",
    definition:
      "A firewall remembering that you initiated an outbound connection, so it automatically lets the matching inbound reply through — without needing an explicit rule allowing that inbound traffic.",
  },
  "default-deny": {
    term: "Default-deny",
    definition:
      "A firewall policy where any traffic not explicitly allowed by a rule is blocked. The opposite, default-allow, lets anything through that isn't explicitly blocked — far riskier, since anything unanticipated gets in by default.",
  },
};
