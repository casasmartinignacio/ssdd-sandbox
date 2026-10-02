"use client";

import type { ReactNode } from "react";
import { Theme, useTheme } from "@/contexts/ThemeContext";
import { fieldStyle } from "@/components/form/fieldStyle";

export function Button({
  children,
  type = "button",
  onClick,
}: {
  children: ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  const dark = useTheme().theme === Theme.DARK;

  return (
    <button type={type} onClick={onClick} style={{ ...fieldStyle(dark), width: "auto", cursor: "pointer" }}>
      {children}
    </button>
  );
}
