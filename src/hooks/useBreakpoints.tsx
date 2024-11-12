import { useCallback } from "react";

import theme from "@/lib/theme";

import { useWindow } from "./useWindow";

type Breakpoint = keyof typeof theme.screens;

const breakpoints: Record<Breakpoint, number> = {
  xs: parseInt(theme.screens.xs as string),
  sm: parseInt(theme.screens.sm as string),
  md: parseInt(theme.screens.md as string),
  lg: parseInt(theme.screens.lg as string),
  xl: parseInt(theme.screens.xl as string),
  "2xl": parseInt(theme.screens["2xl"] as string),
};

export function useBreakpoints() {
  const { width } = useWindow();

  const min = useCallback(
    (bp: Breakpoint) => {
      if (!width) return false;
      return width >= breakpoints[bp];
    },
    [width],
  );

  const max = useCallback(
    (bp: Breakpoint) => {
      if (!width) return false;
      return width < breakpoints[bp];
    },
    [width],
  );

  return { min, max };
}
