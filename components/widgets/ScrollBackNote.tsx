"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

export function ScrollBackNote() {
  const t = useTranslations("scrollBack");
  const [visible, setVisible] = useState(false);
  const [stage, setStage] = useState(1);
  const lastY = useRef(0);
  const stageTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    lastY.current = window.scrollY;

    function clearStageTimers() {
      stageTimers.current.forEach(clearTimeout);
      stageTimers.current = [];
    }

    function show() {
      clearStageTimers();
      setStage(1);
      stageTimers.current.push(setTimeout(() => setStage(2), 700));
      stageTimers.current.push(setTimeout(() => setStage(3), 1500));
      setVisible(true);
    }

    function hide() {
      clearStageTimers();
      setStage(1);
      setVisible(false);
    }

    function onScroll() {
      const y = window.scrollY;
      const scrollingUp = y < lastY.current - 4;
      const scrollingDown = y > lastY.current + 4;

      if (scrollingUp && y > 200) {
        show();
      } else if (scrollingDown) {
        hide();
      }
      lastY.current = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearStageTimers();
    };
  }, []);

  return (
    <div
      className={`fixed right-[22px] top-1/2 z-[43] w-[150px] -translate-y-1/2 text-right transition-all duration-500 md:right-[2.2vw] ${
        visible
          ? "translate-x-0 opacity-100"
          : "pointer-events-none translate-x-3 opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <span className="block font-sans text-[8px] lowercase leading-relaxed tracking-[0.14em] text-muted-ink">
        {t("line1")}
      </span>
      <span
        className={`mt-1.5 block font-sans text-[8px] lowercase leading-relaxed tracking-[0.14em] text-muted-ink transition-all duration-500 ${
          stage >= 2 ? "opacity-100" : "translate-y-1 opacity-0"
        }`}
      >
        {t("line2")}
      </span>
      <span
        className={`mt-1.5 block font-sans text-[8px] lowercase leading-relaxed tracking-[0.14em] transition-all duration-500 ${
          stage >= 3 ? "translate-y-0 text-foreground opacity-100" : "translate-y-1 opacity-0"
        }`}
      >
        {t("line3")}
      </span>
    </div>
  );
}
