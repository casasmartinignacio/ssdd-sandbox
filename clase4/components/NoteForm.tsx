"use client";

import { Form, Formik, type FormikHelpers } from "formik";
import { Button } from "@/components/form/Button";
import { SubmitButton } from "@/components/form/SubmitButton";
import { TextAreaField } from "@/components/form/TextAreaField";
import { TextField } from "@/components/form/TextField";
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
  const dark = useTheme().theme === Theme.DARK;
  const initialValues = {
    title: initialTitle,
    text: initialText,
    minutes: initialMinutes,
  };

  function handleSubmit(values: typeof initialValues, helpers: FormikHelpers<typeof initialValues>) {
    const parsed = noteFormSchema.parse(values);
    onSubmit({
      title: parsed.title,
      text: parsed.text,
      minutes: parsed.minutes,
    });
    if (!editing) helpers.resetForm();
  }

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validate={validateWith(noteFormSchema)}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <section
          style={{
            background: dark ? "#2c261f" : "#fffdf8",
            border: dark ? "1px solid #453c32" : "1px solid #e6dccb",
            borderRadius: 16,
            padding: 20,
            marginBottom: 28,
          }}
        >
          <Form noValidate style={{ display: "grid", gap: 14 }}>
            <TextField
              formik={formik}
              name="title"
              label="Título"
              placeholder="Por ejemplo, llamar al veterinario"
            />
            <TextAreaField formik={formik} name="text" label="Texto" placeholder="Detalle de la nota" />
            <TextField
              formik={formik}
              name="minutes"
              label="Minutos de validez"
              type="number"
              min={1}
              step={1}
              width={120}
            />
            {editing ? (
              <p style={{ margin: 0, color: dark ? "#cbbba6" : "#5c5146", fontSize: 14 }}>
                Al guardar, la validez vuelve a contar desde ahora.
              </p>
            ) : null}
            <div style={{ display: "flex", gap: 8 }}>
              <SubmitButton>{editing ? "Guardar cambios" : "Crear nota"}</SubmitButton>
              {editing ? <Button onClick={onCancel}>Cancelar</Button> : null}
            </div>
          </Form>
        </section>
      )}
    </Formik>
  );
}
