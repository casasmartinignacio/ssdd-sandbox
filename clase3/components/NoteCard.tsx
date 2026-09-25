import { isExpired, type Note } from "@/lib/notes";

type NoteCardProps = {
  theme: "light" | "dark";
  note: Note;
  now: number;
  selected: boolean;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
};

export function NoteCard({ theme, note, now, selected, onEdit, onDelete }: NoteCardProps) {
  const dark = theme === "dark";
  const expired = now > 0 && isExpired(note, now);
  const buttonStyle = {
    border: "1px solid rgba(0,0,0,0.18)",
    background: dark ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.45)",
    color: "#231c14",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
    font: "inherit",
  };

  return (
    <article
      style={{
        background: "#fde68a",
        minHeight: 180,
        padding: 16,
        borderRadius: 4,
        boxShadow: "0 8px 16px rgba(70, 48, 20, 0.12)",
        outline: selected ? (dark ? "2px solid #f6f1e8" : "2px solid #231c14") : "none",
        opacity: expired ? 0.72 : 1,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 18 }}>{note.title}</h3>
      <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.45, flex: 1 }}>
        {note.text || "Sin texto"}
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" style={buttonStyle} onClick={() => onEdit(note)}>
          Editar
        </button>
        <button type="button" style={buttonStyle} onClick={() => onDelete(note.id)}>
          Eliminar
        </button>
      </div>
    </article>
  );
}
