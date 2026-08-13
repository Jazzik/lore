/**
 * Soft blurred glow used to break up otherwise flat, typography-only
 * sections. Purely decorative — position with the className prop.
 */
export function SectionGlow({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -z-10 h-[420px] w-[420px] rounded-full bg-rose/[0.07] blur-[100px] ${className}`}
    />
  );
}

/**
 * Editorial "pinboard" sketch standing in for the reference's character
 * illustration — no real lifestyle photography exists yet, so this carries
 * the "figuring out what to sell" idea without needing an asset.
 */

const CARDS = [
  { top: "6%", left: "8%", rotate: "-6deg", icon: "✦" },
  { top: "18%", left: "58%", rotate: "4deg", icon: "◌" },
  { top: "58%", left: "20%", rotate: "3deg", icon: "□" },
  { top: "64%", left: "62%", rotate: "-4deg", icon: "↗" },
];

export function CharacterPlaceholder() {
  return (
    <div
      className="relative hidden h-[420px] items-center justify-center md:flex"
      aria-hidden
    >
      <div className="absolute h-[280px] w-[280px] rounded-full bg-rose/10 blur-2xl" />

      <svg
        viewBox="0 0 400 420"
        className="absolute inset-0 h-full w-full text-line"
        fill="none"
      >
        <path
          d="M64 46 C 160 110, 180 150, 240 122"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 6"
          strokeLinecap="round"
        />
        <path
          d="M300 168 C 260 220, 200 230, 160 250"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 6"
          strokeLinecap="round"
        />
        <path
          d="M120 260 C 160 300, 220 292, 260 268"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 6"
          strokeLinecap="round"
        />
      </svg>

      <span className="relative font-serif text-[220px] italic leading-none text-rose/25">
        ?
      </span>

      {CARDS.map((card) => (
        <div
          key={card.icon}
          className="absolute grid h-14 w-14 place-items-center rounded-sm border border-line bg-paper text-lg text-foreground/70 shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
          style={{
            top: card.top,
            left: card.left,
            transform: `rotate(${card.rotate})`,
          }}
        >
          {card.icon}
        </div>
      ))}
    </div>
  );
}
