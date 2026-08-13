/**
 * Abstract geometric stand-in for the reference's character illustration —
 * no real lifestyle photography exists yet, so this placeholder carries
 * the composition.
 */

export function CharacterPlaceholder() {
  return (
    <div
      className="relative hidden h-[420px] items-end justify-center md:flex"
      aria-hidden
    >
      <div className="absolute bottom-20 h-[320px] w-[320px] rounded-full bg-rose/10 blur-2xl" />
      <div className="relative h-[70%] w-[55%] rounded-t-[50%] bg-gradient-to-b from-[#241f1a] to-[#0d0b0a]" />
      <div className="absolute bottom-6 h-10 w-[280px] -rotate-2 rounded-full bg-rose/50 blur-[2px]" />
    </div>
  );
}
