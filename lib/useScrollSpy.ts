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

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!mostVisible) return;

        const index = elements.indexOf(mostVisible.target as HTMLElement);
        if (index !== -1) setActiveSlide(index);
      },
      { threshold: [0.5], rootMargin: "-10% 0px -10% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds, setActiveSlide]);
}
