"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { MediaSlot } from "@/components/motion/MediaSlot";

type Act = {
  num: string;
  kicker: string;
  title: string;
  body: string;
  materialTag?: string;
  likesLabel?: string;
  commentsLabel?: string;
  cta?: string;
  reveal?: string;
};

/* ---------------------------------------------------------------------- */
/* Relay icons — box → truck → person, crossfaded by scroll progress      */
/* ---------------------------------------------------------------------- */

function BoxIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path
        d="M32 6 L58 20 L58 44 L32 58 L6 44 L6 20 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M6 20 L32 34 L58 20"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M32 34 L32 58" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function TruckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 56" fill="none" className={className}>
      <path
        d="M4 14 H54 V40 H4 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M54 24 H72 L88 36 V40 H54 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle
        cx="22"
        cy="44"
        r="6"
        stroke="currentColor"
        strokeWidth="1.4"
        className="origin-center animate-spin [animation-duration:1.4s]"
      />
      <circle
        cx="74"
        cy="44"
        r="6"
        stroke="currentColor"
        strokeWidth="1.4"
        className="origin-center animate-spin [animation-duration:1.4s]"
      />
    </svg>
  );
}

function PersonIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <circle cx="32" cy="14" r="8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M32 22 V42" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M32 26 L16 10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M32 26 L48 10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M32 42 L20 58"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M32 42 L44 58"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M14 50 H30 V60 H14 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  );
}

function PhotoIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <rect x="6" y="10" width="36" height="28" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17" cy="20" r="3.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M6 32 L18 22 L26 30 L34 20 L42 30"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function JourneyRelay({ progress }: { progress: MotionValue<number> }) {
  const boxOpacity = useTransform(progress, [0, 0.22, 0.32], [1, 1, 0]);
  const truckOpacity = useTransform(
    progress,
    [0.28, 0.36, 0.64, 0.72],
    [0, 1, 1, 0],
  );
  const personOpacity = useTransform(progress, [0.68, 0.78, 1], [0, 1, 1]);
  const truckX = useTransform(progress, [0.3, 0.7], ["-6%", "106%"]);

  return (
    <div
      aria-hidden
      className="relative mx-auto mb-16 hidden h-16 max-w-[860px] md:mb-20 md:block"
    >
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
      <motion.div
        style={{ opacity: boxOpacity }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground/70"
      >
        <BoxIcon className="h-9 w-9" />
      </motion.div>
      <motion.div
        style={{ opacity: truckOpacity, left: truckX }}
        className="absolute top-1/2 -translate-y-1/2 text-rose"
      >
        <TruckIcon className="h-8 w-14" />
      </motion.div>
      <motion.div
        style={{ opacity: personOpacity }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground/70"
      >
        <PersonIcon className="h-9 w-9" />
      </motion.div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Shared act chrome                                                      */
/* ---------------------------------------------------------------------- */

function ActFrame({
  num,
  kicker,
  title,
  body,
  children,
}: {
  num: string;
  kicker: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-3xl text-rose">{num}</span>
        <span className="text-[10px] uppercase tracking-[0.16em] text-muted-ink">
          {kicker}
        </span>
      </div>
      {children}
      <div>
        <h3 className="font-serif text-2xl leading-tight">{title}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-ink">{body}</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Act 1 — Production: hover light-sweep + flip material chip             */
/* ---------------------------------------------------------------------- */

function ProductionMedia({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line"
    >
      <MediaSlot label={label} className="absolute inset-0">
        <BoxIcon className="h-14 w-14 text-foreground/30" />
      </MediaSlot>

      <div
        className={`pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-foreground/10 to-transparent transition-transform duration-700 ${
          hovered ? "translate-x-[300%]" : "translate-x-0"
        }`}
      />

      <div className="absolute bottom-3 left-3 [perspective:400px]">
        <div
          className="relative h-6 w-[160px] transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: hovered ? "rotateX(180deg)" : "rotateX(0deg)",
          }}
        >
          <span
            className="absolute inset-0 flex items-center rounded-sm border border-line bg-background/85 px-2 text-[9px] uppercase tracking-[0.1em] text-muted-ink"
            style={{ backfaceVisibility: "hidden" }}
          >
            {label}
          </span>
          <span
            className="absolute inset-0 flex items-center rounded-sm border border-line bg-background/85 px-2 text-[9px] uppercase tracking-[0.1em] text-rose"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateX(180deg)",
            }}
          >
            текстиль · дерево · керамика
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Act 2 — Blogger: mouse-tilt phone mockup + kinetic like/comment count  */
/* ---------------------------------------------------------------------- */

function BloggerMedia({
  likesLabel,
  commentsLabel,
}: {
  likesLabel: string;
  commentsLabel: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -10, y: px * 14 });
    setHovered((prev) => (prev ? prev : true));
  }

  useEffect(() => {
    if (!hovered) return;
    const targetLikes = 482;
    const targetComments = 37;
    const steps = 15;
    const stepDuration = 60;
    let step = 0;

    const id = setInterval(() => {
      step += 1;
      const t = Math.min(1, step / steps);
      setLikes(Math.round(targetLikes * t));
      setComments(Math.round(targetComments * t));
      if (t >= 1) clearInterval(id);
    }, stepDuration);

    return () => clearInterval(id);
  }, [hovered]);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setTilt({ x: 0, y: 0 });
        setLikes(0);
        setComments(0);
      }}
      className="relative flex aspect-[4/3] items-center justify-center [perspective:800px]"
    >
      <div
        ref={frameRef}
        className="relative h-full w-[62%] overflow-hidden rounded-[14px] border border-line transition-transform duration-150 ease-out"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-line bg-background/70 px-3 py-2 text-[8px] uppercase tracking-[0.1em] text-muted-ink">
          <span>lore.author</span>
          <span>•••</span>
        </div>
        <MediaSlot className="absolute inset-0">
          <PhotoIcon className="h-10 w-10 text-foreground/30" />
        </MediaSlot>
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-4 border-t border-line bg-background/80 px-3 py-2 text-[9px] text-muted-ink">
          <span>
            ♥ {likes} {likesLabel}
          </span>
          <span>
            ✎ {comments} {commentsLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Act 3 — Unboxing: click-to-open lid + confetti burst                   */
/* ---------------------------------------------------------------------- */

const CONFETTI_DOTS = [
  { x: 20, y: 45, dx: -30, dy: -34, delay: 0 },
  { x: 35, y: 40, dx: -10, dy: -46, delay: 40 },
  { x: 50, y: 38, dx: 4, dy: -50, delay: 10 },
  { x: 65, y: 40, dx: 18, dy: -44, delay: 60 },
  { x: 80, y: 45, dx: 32, dy: -32, delay: 20 },
  { x: 30, y: 55, dx: -22, dy: -20, delay: 90 },
  { x: 70, y: 55, dx: 24, dy: -18, delay: 80 },
] as const;

function UnboxingMedia({ cta, reveal }: { cta: string; reveal: string }) {
  const [open, setOpen] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  function handleToggle() {
    setOpen((prev) => !prev);
    setBurstKey((k) => k + 1);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={open}
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-sm border border-line text-left [perspective:600px]"
    >
      <MediaSlot label={open ? undefined : cta} className="absolute inset-0">
        <BoxIcon className="h-14 w-14 text-foreground/30" />
      </MediaSlot>

      <div
        className="absolute inset-x-0 top-0 z-10 h-[45%] origin-bottom border-b border-line bg-[#221c15] transition-transform duration-500"
        style={{
          transform: open
            ? "rotateX(-125deg) translateY(-10px)"
            : "rotateX(0deg)",
          transformStyle: "preserve-3d",
        }}
      />

      <div
        className={`absolute inset-x-0 bottom-[10%] z-10 flex flex-col items-center gap-1 text-center transition-opacity duration-500 ${
          open ? "opacity-100 delay-200" : "opacity-0"
        }`}
      >
        <span className="font-serif italic text-rose">{reveal}</span>
      </div>

      {open ? (
        <div key={burstKey} className="pointer-events-none absolute inset-0 z-20">
          {CONFETTI_DOTS.map((dot, i) => (
            <span
              key={i}
              style={
                {
                  left: `${dot.x}%`,
                  top: `${dot.y}%`,
                  animationDelay: `${dot.delay}ms`,
                  "--dx": `${dot.dx}px`,
                  "--dy": `${dot.dy}px`,
                } as CSSProperties
              }
              className="absolute h-1.5 w-1.5 rounded-full bg-rose [animation:confettiPop_650ms_ease-out_forwards]"
            />
          ))}
        </div>
      ) : null}

      <span className="absolute bottom-3 right-3 z-10 text-[9px] uppercase tracking-[0.14em] text-muted-ink opacity-0 transition-opacity group-hover:opacity-100">
        {cta}
      </span>
    </button>
  );
}

/* ---------------------------------------------------------------------- */
/* Section                                                                */
/* ---------------------------------------------------------------------- */

export function Journey() {
  const t = useTranslations("journey");
  const titleLines = t.raw("titleLines") as string[];
  const acts = t.raw("acts") as Act[];
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.15"],
  });

  return (
    <section
      id="journey"
      className="flex min-h-svh items-center px-6 py-24 md:px-[8vw]"
    >
      <div ref={containerRef} className="mx-auto w-full max-w-[1380px]">
        <Reveal className="mb-14 max-w-[640px]">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-ink">
            {t("eyebrow")}
          </span>
          <h2 className="mt-4 font-serif text-[clamp(40px,6vw,90px)] leading-[0.9] tracking-[-0.045em]">
            {titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <em className="italic text-rose">{t("titleAccent")}</em>
          </h2>
          <p className="mt-6 max-w-[480px] text-[15px] leading-relaxed text-foreground/80">
            {t("body")}
          </p>
        </Reveal>

        <JourneyRelay progress={scrollYProgress} />

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {acts.map((act, i) => (
            <Reveal key={act.num} delay={i * 0.08}>
              <ActFrame
                num={act.num}
                kicker={act.kicker}
                title={act.title}
                body={act.body}
              >
                {i === 0 ? (
                  <ProductionMedia label={act.materialTag ?? ""} />
                ) : i === 1 ? (
                  <BloggerMedia
                    likesLabel={act.likesLabel ?? ""}
                    commentsLabel={act.commentsLabel ?? ""}
                  />
                ) : (
                  <UnboxingMedia cta={act.cta ?? ""} reveal={act.reveal ?? ""} />
                )}
              </ActFrame>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
