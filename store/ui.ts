import { create } from "zustand";

interface UIState {
  activeSlide: number;
  setActiveSlide: (index: number) => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  floatingWidgetDismissed: boolean;
  dismissFloatingWidget: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeSlide: 0,
  setActiveSlide: (index) => set({ activeSlide: index }),
  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  floatingWidgetDismissed: false,
  dismissFloatingWidget: () => set({ floatingWidgetDismissed: true }),
}));
