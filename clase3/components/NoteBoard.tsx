import { NoteCard } from "@/components/NoteCard";
import { Theme, useTheme } from "@/contexts/ThemeContext";
import type { Note } from "@/lib/notes";

type NoteBoardProps = {
  notes: Note[];
  ready: boolean;
  now: number;
  editingId: string | null;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
};

export function NoteBoard({
  notes,
  ready,
  now,
  editingId,
  onEdit,
  onDelete,
}: NoteBoardProps) {
  const { theme } = useTheme();
  const muted = theme === Theme.DARK ? "#cbbba6" : "#5c5146";

  return (
    <section>
      <h2 style={{ margin: "0 0 14px", fontSize: 18 }}>
        Tablero {ready ? `(${notes.length})` : ""}
      </h2>
      {!ready ? (
        <p style={{ color: muted }}>Cargando notas...</p>
      ) : notes.length === 0 ? (
        <p style={{ color: muted }}>Todavía no hay notas en el tablero.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 18,
          }}
        >
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              theme={theme}
              note={note}
              now={now}
              selected={editingId === note.id}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
