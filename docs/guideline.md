# Interactive walkthrough pedagogy guidelines

Design checklist for every interactive Chapter (see [`content-hierarchy.md`](./content-hierarchy.md)
for the Module/Unit/Chapter/Section/Step vocabulary used below). Apply this to every new Chapter,
and when reviewing/fixing an existing one.

## Format and structure

- Main content is an **interactive slideshow**: users progress through it Step by Step.
- It's fine for a Chapter to have many Steps — explain every single item one at a time rather
  than compressing several ideas into one Step.
- Break a Chapter into **Sections** (e.g. the Regression Chapter is split into Sections like
  "Linear Model" and "Overfitting"). Apply the same Section structure to every other Chapter.
- Within a Step, the layout order is always **title → description → figure**, at every screen
  width — not just on mobile. A figure must never sit beside the text (e.g. in a left/right
  grid), only below it, so that step text can always safely say "the picture below" without
  becoming wrong on wider screens.
- A Chapter's first Step should be titled **"What you learn from this chapter"**: a short
  overview paired with a plain table of contents listing the Chapter's Sections, with **no
  diagram**.
- Immediately after that first Step, insert a second Step. Its content is a short overall summary
  of the whole Chapter paired with **one diagram** representing it (reusing the Chapter's own
  hero visual — e.g. a diagram shown later in the Chapter — is fine).
- After every Step is complete, show **"Explore it yourself"**: a free-play sandbox UI (currently
  rendered as the bottom half of the page) unlocked once the walkthrough is finished.

## Tone

- The teacher persona is **warm and approachable** — never cool, aloof, or mysterious.
- **Do not write like a review for people who already know the material.** Write for a reader
  who has completed the prior Chapters/Units but is genuinely new to this one — don't assume
  familiarity with this Chapter's own vocabulary just because it's connected to something
  they've already learned.
- **Write for the app's first-time end user, never for whoever is directing the writing.**
  The person requesting or reviewing a Chapter's content (in chat, in a design doc, in an
  earlier planning session) already knows the whole planned story — the actual reader does
  not, and the copy must stand on its own from that reader's perspective, not the writer's.
  Concretely: a specific character, object, or plot event can only be referred to with a
  definite/anaphoric phrase ("that photo," "the board," "this problem") once the reader
  has actually met it earlier in the reading order — check the reader's position, not
  whether the requester already knows about it from an earlier conversation. E.g. a
  Chapter's own intro promising what's coming ("...before he gets to send **that** cheese
  photo") is wrong the moment that photo hasn't been introduced to the reader yet; use an
  indefinite phrase instead ("...before he gets around to sharing **a** photo with the
  world") until the specific thing has actually been shown.

## Per-step content

- Keep the **new information introduced per Step to a minimum**.
- Keep the **explanation text concise**. If a concept needs more depth than that, don't inline
  it — put the fuller explanation behind a click/tap-triggered tooltip (a `Term`/glossary-style
  component), triggered on **click/tap, not mouse hover** (the app must work on mobile, where
  hover doesn't exist).
- **Avoid redundant or wordy phrasing.** If a Step's text risks running long, don't just write a
  longer paragraph — use paragraphs, line breaks, bullet lists, tables, or diagrams to keep it
  easy to scan.
- **No unbroken run of prose longer than ~50 words.** Count the whole continuous block — e.g.
  a `<p>`'s full text — not sentence by sentence: several short sentences run together in one
  paragraph with no list, heading, or diagram between them still count as a single unbroken run,
  and their word counts add up. If a block would run past 50 words with no structural break in
  it, resolve it — depending on what the content actually is — by turning it into a bullet list,
  splitting it into multiple subheading+body sections, showing it as a diagram, or rewording it
  more concisely. Never let conciseness make it harder to understand than the longer version
  would have been — clarity always wins over the character count when the two are in tension.
- Place **one or two graphs, 3D visualizations, or diagrams** per Step.
- **3D figures must be user-rotatable.**
- **Graphs must label both axes** (x and y).
- **Important equations must be visually prominent** (not buried in a sentence).

## Story text

Where a Step has a picture-book "story" half above the technical explanation:

- Connect not just the concluding moment but the reasoning/process that leads up to it — narrate
  the "why," not only the "what happened." Weave that connective reasoning into dialogue between
  characters rather than flat third-person narration wherever the scene allows for it, and keep
  using dialogue through the conclusion itself too — don't drop into a bare third-person statement
  of the outcome right at the end. The area immediately around the conclusion needs a line of
  dialogue connecting it to what came before, same as every earlier beat in the exchange.
- Format dialogue as `Speaker: "quote"`, one line per utterance, separated by a line break — never
  chain multiple speakers' lines into one flowing sentence with embedded quotation marks.
- The same ~50-word cap that applies to a prose block (see "Per-step content" above) applies to a
  single line of dialogue too — split a longer exchange across multiple lines/turns, or trim it,
  rather than letting one quoted line run past the limit.
- Render each `Speaker: "quote"` line as a white speech-bubble-style card (shared `StoryText`
  component) so dialogue visually stands out from plain narration lines, which stay unstyled
  directly on the paper background.

## Notation

- **Keep variable names and mathematical symbols consistent everywhere they appear** — in prose,
  in equations, and in figures/diagrams alike. The same quantity must never pick up a different
  symbol depending on where it's shown.
- **Make it visually clear whether something is a vector, a matrix, or a single component of a
  vector** — through notation, labeling, or how it's described — so a reader can always tell
  which one they're looking at.

## Interactivity

- Where a Step lets the user adjust values or settings (drag, click, type), it must be genuinely
  interactive, not just illustrative.
- If a Step has a button that advances some sandbox state, it must also have an **undo/back**
  button.
- Whatever change a user can make in a Step, there must be a way to **undo or reset** it.

## Typography

- **Minimum font size is 14px**, reserved for genuinely supplementary/sub text only — captions,
  eyebrow labels, badges, axis/range endpoint labels, secondary readouts (e.g. a MAC address
  shown under a primary IP address). Everything else (primary labels, body text, alert/warning
  text, node names in a diagram) has a **15px floor**. The one exception is text whose role
  inherently requires smallness regardless of these floors (subscripts, superscripts, exponents).

## Platform

- **Language: English** (multi-language support is a planned future addition — don't hardcode
  assumptions that block it).
- **Responsive design**: the app must be usable on mobile, not just desktop.
