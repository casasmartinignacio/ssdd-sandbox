"use client";

import type { ReactNode } from "react";
import { Theme, useTheme } from "@/contexts/ThemeContext";

export function SubmitButton({ children }: { children: ReactNode }) {
  const dark = useTheme().theme === Theme.DARK;

  return (
    <button
      type="submit"
      style={{
        border: 0,
        background: dark ? "#f6f1e8" : "#231c14",
        color: dark ? "#231c14" : "#fffdf8",
        borderRadius: 10,
        padding: "10px 14px",
        cursor: "pointer",
        font: "inherit",
      }}
    >
      {children}
    </button>
  );
}
