"use client";

import { NotesApp } from "@/components/NotesApp";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function Home() {
  return (
    <ThemeProvider>
      <NotesApp />
    </ThemeProvider>
  )
}
