"use client";

import { useState } from "react";

type NoteFormProps = {
  theme: "light" | "dark";
  editing: boolean;
  initialTitle: string;
  initialText: string;
  initialMinutes: string;
  onSubmit: (values: { title: string; text: string; minutes: number }) => void;
  onCancel: () => void;
};

export function NoteForm({
  theme,
  editing,
  initialTitle,
  initialText,
  initialMinutes,
  onSubmit,
  onCancel,
}: NoteFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [text, setText] = useState(initialText);
  const [minutesInput, setMinutesInput] = useState(initialMinutes);
  const [error, setError] = useState("");
  const dark = theme === "dark";
  const inputStyle = {
    border: dark ? "1px solid #5c5146" : "1px solid #d9d0c3",
    background: dark ? "#1c1915" : "#fff",
    color: dark ? "#f6f1e8" : "#231c14",
    borderRadius: 10,
    padding: "10px 12px",
    font: "inherit",
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim();
    const nextText = text.trim();
    const minutes = Number(minutesInput);

    if (!nextTitle) {
      setError("El título es obligatorio.");
      return;
    }
    if (!Number.isInteger(minutes) || minutes < 1) {
      setError("Los minutos de validez tienen que ser un entero mayor a 0.");
      return;
    }

    onSubmit({ title: nextTitle, text: nextText, minutes });
    setTitle("");
    setText("");
    setMinutesInput("1");
    setError("");
  }

  return (
    <section
      style={{
        background: dark ? "#2c261f" : "#fffdf8",
        border: dark ? "1px solid #453c32" : "1px solid #e6dccb",
        borderRadius: 16,
        padding: 20,
        marginBottom: 28,
      }}
    >
      <form noValidate onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
        <label style={{ display: "grid", gap: 6 }}>
          Título
          <input
            value={title}
            placeholder="Por ejemplo, llamar al veterinario"
            onChange={(event) => setTitle(event.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          Texto
          <textarea
            value={text}
            rows={3}
            placeholder="Detalle de la nota"
            onChange={(event) => setText(event.target.value)}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          Minutos de validez
          <input
            type="number"
            min={1}
            step={1}
            value={minutesInput}
            onChange={(event) => setMinutesInput(event.target.value)}
            style={{ ...inputStyle, width: 120 }}
          />
        </label>

        {error ? <p style={{ margin: 0, color: "#8a3b2c" }}>{error}</p> : null}
        {editing ? (
          <p style={{ margin: 0, color: "#5c5146", fontSize: 14 }}>
            Al guardar, la validez vuelve a contar desde ahora.
          </p>
        ) : null}

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            style={{
              ...inputStyle,
              border: 0,
              background: dark ? "#f6f1e8" : "#231c14",
              color: dark ? "#231c14" : "#fffdf8",
              cursor: "pointer",
            }}
          >
            {editing ? "Guardar cambios" : "Crear nota"}
          </button>
          {editing ? (
            <button type="button" onClick={onCancel} style={{ ...inputStyle, cursor: "pointer" }}>
              Cancelar
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
