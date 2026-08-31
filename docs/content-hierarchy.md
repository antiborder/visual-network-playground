# Content hierarchy: naming convention

This app's interactive learning content is organized into five nested levels. Use these names
consistently in code, comments, docs, and conversation — never "tab," "page," or "section" as a
loose synonym for a level other than the one it actually names below.

```
Module      "Beginner"                            (top-level nav item, e.g. lib/modules.ts)
  └ Unit        "IP Address & Wi-Fi/LAN"               (one page, e.g. /beginner/ip-address-wifi)
      └ Chapter     "Chapter 1: Leaving the House"          (one walkthrough, tab-switched against
                                                              its Unit's other Chapters — see below)
          └ Section     "Leaving the House"                    (a segment in the SegmentedProgressBar)
              └ Step         "The border checkpoint"               (one screen/slide)
```

## Definitions

| Level | Name | What it is | Example |
|---|---|---|---|
| 1 | **Step** | The smallest unit — one screen of the interactive slideshow: a title, a short explanation, one or two figures, sometimes controls. | "Try changing an address" |
| 2 | **Section** | A group of consecutive Steps within one Chapter, sharing one topic. Rendered as one segment of the `SegmentedProgressBar`. | "2. IP Address & Subnet" |
| 3 | **Chapter** | One self-contained walkthrough (Steps + a free-play sandbox unlocked at the end). Most Units have exactly one; a Unit with multiple Chapters tab-switches between them (see below). | "Chapter 1: Leaving the House" |
| 4 | **Unit** | One page (one route). In `docs/curriculum.md`'s design, most Units contain exactly one Chapter — no tab-switcher needed. | "IP Address & Wi-Fi/LAN" (`/beginner/ip-address-wifi`) |
| 5 | **Module** | The top-level nav grouping, containing multiple Units. Matches `docs/curriculum.md`'s four levels (【初級】【中級】【中級上】【上級】) and `frontend/lib/modules.ts`'s `MODULES` array. | "Beginner" |

## Why Unit and Chapter usually coincide here — and Unit 1's exception

ai-engineering-lab (the app this project's structure/pedagogy is modeled on) has Units that hold
several tab-switched Chapters (e.g. its Classical ML Unit holds Regression/Classification/
Clustering as three Chapters). This app's curriculum (`docs/curriculum.md`) mostly gives every
topic its own page with exactly one Chapter, so no tab-switcher is needed for those Units.

**Unit 1 ("IP Address & Wi-Fi/LAN") is the first exception**: it legitimately splits into three
parallel Chapters — "Leaving the House," "The Short Way Home," and "Momo Gets Online" — each its
own full Walkthrough + Lab, tab-switched exactly like ai-engineering-lab's Classical ML Unit:
`features/beginner/ip-address-wifi/IpAddressWifiPlayground.tsx` holds a plain `useState`-driven
tab strip; each Chapter is a flat `<Chapter>Walkthrough.tsx` + `<Chapter>Lab.tsx` pair in the same
feature folder (not a subfolder per Chapter), sharing flat data/component files
(`network.ts`, `LanMap.tsx`, etc.) across all three. Switching tabs fully unmounts the inactive
Chapter, so its walkthrough progress resets on return — matching ai-engineering-lab's actual
behavior, not a simplification. Follow this same pattern if another future topic legitimately
splits into multiple parallel Chapters, rather than building a bespoke switcher.
