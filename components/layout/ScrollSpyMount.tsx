"use client";

import { useScrollSpy } from "@/lib/useScrollSpy";
import { SLIDE_IDS } from "@/lib/sections";

export function ScrollSpyMount() {
  useScrollSpy([...SLIDE_IDS]);
  return null;
}
