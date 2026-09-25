"use client";

/* eslint-disable react-hooks/set-state-in-effect -- el tablero se hidrata desde localStorage y confirma las notificaciones ya enviadas */

import { useEffect, useState } from "react";
import { NoteBoard } from "@/components/NoteBoard";
import { NoteForm } from "@/components/NoteForm";
import { parseStoredNotes, STORAGE_KEY, isExpired, type Note } from "@/lib/notes";
import { useTheme } from "@/contexts/ThemeContext";
import axios from "axios";

const announcedIds = new Set<string>();

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(0);
  const [editing, setEditing] = useState<Note | null>(null);

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const stored = parseStoredNotes(window.localStorage.getItem(STORAGE_KEY));
    setNotes(stored);
    setReady(true);
    setNow(Date.now());
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes, ready]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!ready || now === 0) return;
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;

    const due = notes.filter(
      (note) => isExpired(note, now) && !note.notified && !announcedIds.has(note.id),
    );
    if (due.length === 0) return;

    const sent: string[] = [];
    for (const note of due) {
      announcedIds.add(note.id);
      try {
        new Notification(`Recordatorio: ${note.title}`, {
          body: note.text
            ? `${note.text} — se cumplieron ${note.minutes} min de validez.`
            : `Se cumplieron ${note.minutes} min de validez.`,
        });
        sent.push(note.id);
      } catch {
        announcedIds.delete(note.id);
      }
    }

    if (sent.length === 0) return;
    setNotes((current) =>
      current.map((note) => (sent.includes(note.id) ? { ...note, notified: true } : note)),
    );
  }, [notes, now, ready]);

  const onPersist = async () => {
    try {
      const parsedNotes = notes.map((note) => ({
        title: note.title,
        body: note.text,
      }));
      const response = await axios.post("/api/notes", {
        notes: parsedNotes || [],
      });
      alert(`Notas persistidas!!! ${response?.data?.data}`);
    } catch (error) {
      console.error(error);
    }
  };

  function saveNote(values: { title: string; text: string; minutes: number }) {
    if (editing) {
      announcedIds.delete(editing.id);
      setNotes((current) =>
        current.map((note) =>
          note.id === editing.id
            ? {
                ...note,
                title: values.title,
                text: values.text,
                minutes: values.minutes,
                createdAt: Date.now(),
                notified: false,
              }
            : note,
        ),
      );
      setEditing(null);
      return;
    }

    setNotes((current) => [
      {
        id: crypto.randomUUID(),
        title: values.title,
        text: values.text,
        minutes: values.minutes,
        createdAt: Date.now(),
        notified: false,
      },
      ...current,
    ]);
  }

  function removeNote(id: string) {
    announcedIds.delete(id);
    setNotes((current) => current.filter((note) => note.id !== id));
    if (editing?.id === id) setEditing(null);
  }

  const dark = theme === "dark";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: dark ? "#1c1915" : "#f4efe6",
        color: dark ? "#f6f1e8" : "#231c14",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        padding: "36px 20px 72px",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <h1 style={{ margin: 0, fontSize: 36, letterSpacing: "-0.03em" }}>Sticky notes</h1>
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              border: dark ? "1px solid #5c5146" : "1px solid #d9d0c3",
              background: dark ? "#2c261f" : "#fffdf8",
              color: "inherit",
              borderRadius: 10,
              padding: "10px 14px",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            {dark ? "Modo claro" : "Modo oscuro"}
          </button>
          <button
            type="button"
            onClick={onPersist}
            style={{
              border: dark ? "1px solid #5c5146" : "1px solid #d9d0c3",
              background: dark ? "#2c261f" : "#fffdf8",
              color: "inherit",
              borderRadius: 10,
              padding: "10px 14px",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            Persistir notas
          </button>
        </header>

        <NoteForm
          key={editing?.id ?? "new"}
          editing={editing !== null}
          initialTitle={editing?.title ?? ""}
          initialText={editing?.text ?? ""}
          initialMinutes={editing ? String(editing.minutes) : "1"}
          onSubmit={saveNote}
          onCancel={() => setEditing(null)}
        />

        <NoteBoard
          notes={notes}
          ready={ready}
          now={now}
          editingId={editing?.id ?? null}
          onEdit={setEditing}
          onDelete={removeNote}
        />
      </div>
    </main>
  );
}
