"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/ui";

export function useScrollSpy(sectionIds: string[]) {
  const setActiveSlide = useUIStore((state) => state.setActiveSlide);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // Fine-grained thresholds (rather than a single 0.5 cutoff) so the
    // callback fires continuously as each section's visible ratio changes.
    // A single 0.5 threshold requires a section to occupy at least half of
    // the -10% margin root (0.8 × viewport) to ever register — sections
    // taller than 1.6× the viewport (e.g. Quality at 1296px against an
    // 800px-tall viewport) never cross it and the nav sticks on whatever
    // section fired last. Selecting the highest ratio among all
    // intersecting entries, rather than requiring one to cross a fixed
    // threshold, keeps this correct for any section height.
    const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.intersectionRatio > 0)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!mostVisible) return;

        const index = elements.indexOf(mostVisible.target as HTMLElement);
        if (index !== -1) setActiveSlide(index);
      },
      { threshold: THRESHOLDS, rootMargin: "-10% 0px -10% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds, setActiveSlide]);
}
