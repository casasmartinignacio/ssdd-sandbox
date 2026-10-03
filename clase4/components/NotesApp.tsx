"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/form/Button";
import { ErrorText } from "@/components/form/ErrorText";
import { NoteBoard } from "@/components/NoteBoard";
import { NoteForm } from "@/components/NoteForm";
import { Theme, useTheme } from "@/contexts/ThemeContext";
import { useLogout, useMe } from "@/hooks/useAuth";
import { useCreateNote, useDeleteNote, useMarkNoteNotified, useNotes, useUpdateNote } from "@/hooks/useNotes";
import { isExpired, type Note } from "@/lib/notes";
import type { CreateNoteRequest } from "@/services/notes";

const announcedIds = new Set<string>();

export function NotesApp() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [now, setNow] = useState(0);
  const [editing, setEditing] = useState<Note | null>(null);

  const me = useMe();
  const notesQuery = useNotes();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const { mutate: markNoteNotified } = useMarkNoteNotified();
  const logout = useLogout();
  const notes = notesQuery.data;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!notes || now === 0) return;
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;

    const due = notes.filter(
      (note) => isExpired(note, now) && !note.notified && !announcedIds.has(note.id),
    );

    for (const note of due) {
      announcedIds.add(note.id);
      try {
        new Notification(`Recordatorio: ${note.title}`, {
          body: note.text
            ? `${note.text} — se cumplieron ${note.minutes} min de validez.`
            : `Se cumplieron ${note.minutes} min de validez.`,
        });
      } catch {
        announcedIds.delete(note.id);
        continue;
      }

      markNoteNotified(note.id, {
        onError: () => announcedIds.delete(note.id),
      });
    }
  }, [notes, now, markNoteNotified]);

  function saveNote(values: CreateNoteRequest) {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      void Notification.requestPermission();
    }

    if (editing) {
      announcedIds.delete(editing.id);
      updateNote.mutate({ id: editing.id, ...values }, { onSuccess: () => setEditing(null) });
      return;
    }

    createNote.mutate(values);
  }

  function removeNote(id: string) {
    announcedIds.delete(id);
    deleteNote.mutate(id);
    if (editing?.id === id) setEditing(null);
  }

  async function handleLogout() {
    await logout.mutateAsync();
    router.push("/login");
    router.refresh();
  }

  const dark = theme === Theme.DARK;

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
          <div>
            <h1 style={{ margin: 0, fontSize: 36, letterSpacing: "-0.03em" }}>Sticky notes</h1>
            {me.data ? (
              <p style={{ margin: "6px 0 0", color: dark ? "#cbbba6" : "#5c5146" }}>{me.data.name}</p>
            ) : null}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button onClick={toggleTheme}>{dark ? "Modo claro" : "Modo oscuro"}</Button>
            <Button onClick={() => void handleLogout()}>Salir</Button>
          </div>
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

        <ErrorText message={notesQuery.isError ? "No se pudieron cargar las notas." : undefined} />

        <NoteBoard
          notes={notes ?? []}
          ready={!notesQuery.isLoading}
          now={now}
          editingId={editing?.id ?? null}
          onEdit={setEditing}
          onDelete={removeNote}
        />
      </div>
    </main>
  );
}
