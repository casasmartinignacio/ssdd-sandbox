"use client";

import { useFormik } from "formik";
import { Theme, useTheme } from "@/contexts/ThemeContext";
import { noteFormSchema, validateWith } from "@/lib/schemas";

type NoteFormProps = {
  editing: boolean;
  initialTitle: string;
  initialText: string;
  initialMinutes: string;
  onSubmit: (values: { title: string; text: string; minutes: number }) => void;
  onCancel: () => void;
};

export function NoteForm({
  editing,
  initialTitle,
  initialText,
  initialMinutes,
  onSubmit,
  onCancel,
}: NoteFormProps) {
  const { theme } = useTheme();
  const dark = theme === Theme.DARK;
  const formik = useFormik({
    initialValues: {
      title: initialTitle,
      text: initialText,
      minutes: initialMinutes,
    },
    enableReinitialize: true,
    validate: validateWith(noteFormSchema),
    onSubmit: (values, helpers) => {
      const parsed = noteFormSchema.parse(values);
      onSubmit({
        title: parsed.title,
        text: parsed.text,
        minutes: parsed.minutes,
      });
      if (!editing) helpers.resetForm();
    },
  });

  const inputStyle = {
    border: dark ? "1px solid #5c5146" : "1px solid #d9d0c3",
    background: dark ? "#1c1915" : "#fff",
    color: dark ? "#f6f1e8" : "#231c14",
    borderRadius: 10,
    padding: "10px 12px",
    font: "inherit",
  };

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
      <form noValidate onSubmit={formik.handleSubmit} style={{ display: "grid", gap: 14 }}>
        <label style={{ display: "grid", gap: 6 }}>
          Título
          <input
            name="title"
            value={formik.values.title}
            placeholder="Por ejemplo, llamar al veterinario"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={inputStyle}
          />
          {formik.touched.title && formik.errors.title ? (
            <span style={{ color: "#8a3b2c", fontSize: 14 }}>{formik.errors.title}</span>
          ) : null}
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          Texto
          <textarea
            name="text"
            value={formik.values.text}
            rows={3}
            placeholder="Detalle de la nota"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          Minutos de validez
          <input
            name="minutes"
            type="number"
            min={1}
            step={1}
            value={formik.values.minutes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ ...inputStyle, width: 120 }}
          />
          {formik.touched.minutes && formik.errors.minutes ? (
            <span style={{ color: "#8a3b2c", fontSize: 14 }}>{formik.errors.minutes}</span>
          ) : null}
        </label>

        {editing ? (
          <p style={{ margin: 0, color: dark ? "#cbbba6" : "#5c5146", fontSize: 14 }}>
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
