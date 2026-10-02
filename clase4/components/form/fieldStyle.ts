import type { CSSProperties } from "react";

export function fieldStyle(dark: boolean): CSSProperties {
  return {
    border: dark ? "1px solid #5c5146" : "1px solid #d9d0c3",
    background: dark ? "#1c1915" : "#fff",
    color: dark ? "#f6f1e8" : "#231c14",
    borderRadius: 10,
    padding: "10px 12px",
    font: "inherit",
    width: "100%",
  };
}
