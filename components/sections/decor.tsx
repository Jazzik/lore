/**
 * Abstract geometric stand-ins for the reference's photographic product
 * cutouts / character illustration — no real product or lifestyle
 * photography exists yet, so these placeholders carry the composition.
 */

export function ProductScenePlaceholder() {
  return (
    <div className="relative hidden min-h-[420px] md:block" aria-hidden>
      <div className="absolute right-[17%] top-[6%] h-[300px] w-[120px] rotate-[4deg] rounded-[32px] bg-gradient-to-br from-[#241f1a] to-[#332b23] shadow-2xl shadow-black/40" />
      <div className="absolute right-[1%] top-[30%] h-[280px] w-[85px] rounded-[10px] bg-gradient-to-br from-rose to-[#8f5b64]" />
      <div className="absolute right-[26%] top-[2%] h-[130px] w-[220px] rounded-[50px_50px_16px_16px] bg-gradient-to-br from-[#2a241e] to-[#3a3128]" />
      <div className="absolute bottom-[6%] right-[21%] h-[200px] w-[260px] -rotate-[5deg] rounded-[28px] bg-gradient-to-br from-[#241f1a] to-[#332b23]" />
      <div className="absolute right-[43%] top-[36%] h-[100px] w-[130px] rounded-xl bg-gradient-to-br from-[#2a241e] to-[#3a3128]" />
      <div className="absolute bottom-[2%] right-[40%] h-[110px] w-[190px] overflow-hidden rounded-md bg-gradient-to-br from-[#2a241e] to-[#3a3128]">
        <div className="absolute inset-y-0 left-[8%] w-[82%] opacity-70 [background-image:repeating-linear-gradient(90deg,rgba(201,141,152,.55)_0_12px,rgba(183,121,132,.4)_12px_24px)]" />
      </div>
    </div>
  );
}

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
