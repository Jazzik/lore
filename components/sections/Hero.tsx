"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { HERO_VIDEOS } from "@/lib/heroVideos";

const HERO_VIDEO_INTERVAL_MS = 5500;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: i * 0.1, ease: [0.22, 0.7, 0.18, 1] },
  }),
};

export function Hero() {
  const t = useTranslations("hero");
  const taglineLines = t.raw("taglineLines") as string[];
  const [videoIndex, setVideoIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setVideoIndex((i) => (i + 1) % HERO_VIDEOS.length);
    }, HERO_VIDEO_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-svh items-center overflow-hidden px-6 pb-20 pt-28 md:px-[8vw] md:pb-24 md:pt-[110px]"
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_72%_22%,rgba(201,141,152,0.2),transparent_45%),linear-gradient(180deg,#0d0b0a_0%,#17140f_55%,#0d0b0a_100%)]" />
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,#000_55%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,#000_55%,transparent_100%)]"
        >
          <AnimatePresence mode="sync">
            <motion.video
              key={videoIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 h-full w-full object-cover blur-[2px]"
              autoPlay
              loop
              muted
              playsInline
              src={HERO_VIDEOS[videoIndex]}
            />
          </AnimatePresence>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,11,10,0.45)_0%,rgba(13,11,10,0.6)_45%,rgba(13,11,10,0.92)_85%,rgba(13,11,10,1)_100%)]" />
      </div>

      <div className="mx-auto w-full max-w-[1380px]">
        <motion.p
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          className="text-[10px] uppercase tracking-[0.22em] text-muted-ink"
        >
          {t("eyebrow")}
        </motion.p>

        <motion.h1
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeUp}
          className="-ml-[0.02em] font-serif text-[clamp(90px,22vw,320px)] leading-[0.7] tracking-[-0.06em] text-foreground"
        >
          {t("wordmark")}
        </motion.h1>

        <div className="mt-10 grid gap-10 md:mt-16 md:grid-cols-[28%_1fr] md:gap-[8vw]">
          <motion.h2
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="font-serif text-[clamp(28px,3vw,48px)] leading-[0.98] tracking-[-0.045em] text-foreground"
          >
            {taglineLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <em className="block font-serif italic text-rose">
              {t("taglineAccent")}
            </em>
          </motion.h2>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUp}
            className="max-w-[520px]"
          >
            <p className="text-[15px] leading-relaxed text-foreground/80">
              {t("body")}
            </p>
            <div className="mt-11 h-px w-full bg-line" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
