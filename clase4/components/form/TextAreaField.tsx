"use client";

import type { FormikProps } from "formik";
import { Theme, useTheme } from "@/contexts/ThemeContext";
import { ErrorText } from "@/components/form/ErrorText";
import { fieldStyle } from "@/components/form/fieldStyle";

type TextAreaFieldProps<Values extends Record<string, string | number>> = {
  formik: FormikProps<Values>;
  name: Extract<keyof Values, string>;
  label: string;
  placeholder?: string;
  rows?: number;
};

export function TextAreaField<Values extends Record<string, string | number>>({
  formik,
  name,
  label,
  placeholder,
  rows = 3,
}: TextAreaFieldProps<Values>) {
  const dark = useTheme().theme === Theme.DARK;
  const meta = formik.getFieldMeta(name);
  const error = meta.touched && typeof meta.error === "string" ? meta.error : undefined;

  return (
    <label style={{ display: "grid", gap: 6 }}>
      {label}
      <textarea
        name={name}
        value={String(formik.values[name] ?? "")}
        placeholder={placeholder}
        rows={rows}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        style={{ ...fieldStyle(dark), resize: "vertical" }}
      />
      <ErrorText message={error} />
    </label>
  );
}
