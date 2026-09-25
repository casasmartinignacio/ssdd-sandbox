"use client";

import { useState } from "react";
import { NotesApp } from "@/components/NotesApp";

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return <NotesApp theme={theme} onToggleTheme={toggleTheme} />;
}
