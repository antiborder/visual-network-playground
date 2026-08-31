/** Matches one "Speaker: "quote"" line — see docs/guideline.md's "Story text"
 * section. Captures the speaker label and the quoted line separately so
 * they can be styled differently from plain narration lines. */
const DIALOGUE_LINE = /^([^":]+):\s*"(.+)"$/;

/** Renders a picture-book Step's story text, one line per `\n`. A line
 * matching `Speaker: "quote"` renders as a white speech-bubble-like card so
 * dialogue visually stands out from the surrounding narration, which stays
 * plain italic text directly on the paper background. */
export function StoryText({ text }: { text: string }) {
  return (
    <div className="space-y-1.5">
      {text.split("\n").map((line, i) => {
        const match = line.match(DIALOGUE_LINE);
        if (!match) {
          return (
            <p key={i} className="text-sm italic leading-relaxed text-storybook-ink/80">
              {line}
            </p>
          );
        }
        const [, speaker, quote] = match;
        return (
          <div key={i}>
            <p className="inline-block w-fit max-w-full rounded-md bg-white px-2.5 py-1.5 text-sm italic leading-relaxed text-storybook-ink/80 shadow-sm">
              <span className="font-semibold not-italic text-storybook-accent-dark">{speaker}:</span> &ldquo;{quote}&rdquo;
            </p>
          </div>
        );
      })}
    </div>
  );
}
