"use client";

import type { ReactNode } from "react";
import { Form } from "formik";
import { Theme, useTheme } from "@/contexts/ThemeContext";

export function AuthForm({ title, children }: { title: string; children: ReactNode }) {
  const dark = useTheme().theme === Theme.DARK;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: dark ? "#1c1915" : "#f4efe6",
        color: dark ? "#f6f1e8" : "#231c14",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        padding: 24,
      }}
    >
      <Form
        noValidate
        style={{
          width: "100%",
          maxWidth: 420,
          display: "grid",
          gap: 14,
          background: dark ? "#2c261f" : "#fffdf8",
          border: dark ? "1px solid #453c32" : "1px solid #e6dccb",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <h1 style={{ margin: 0 }}>{title}</h1>
        {children}
      </Form>
    </main>
  );
}
