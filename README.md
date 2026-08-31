# Network Interactive Lab

Network Interactive Lab teaches how computer networks actually work through interactive 2D
visualizations and hands-on experiments, not slides: drag an IP address, watch two devices
collide, send a packet and see exactly which device picks it up. The goal is understanding, not
memorization — you learn an idea by experiencing it.

It covers networking end-to-end across four levels, from everyday questions about how devices
"connect" up to production traffic control:

1. **Beginner** — IP addressing, DNS, Wi-Fi/LAN basics, firewalls
2. **Intermediate** — packet fragmentation, routing, ports & application routing
3. **Upper Intermediate** — NAT/NAPT, TLS/SSL, CDNs
4. **Advanced** — TCP reliability, load balancing

Full curriculum: [`docs/plan.md`](docs/plan.md).

## Repository layout

```text
docs/      curriculum plan and design notes
frontend/  Next.js + TypeScript
```

Every topic is a purely client-side simulation, so there's no backend or infrastructure yet — if
a future topic genuinely needs server-side computation, add it then.

## Local development

```bash
cd frontend
pnpm install
pnpm dev        # http://localhost:3000
pnpm test       # vitest
pnpm lint
pnpm exec tsc --noEmit
```
