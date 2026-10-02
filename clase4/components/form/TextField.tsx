"use client";

import type { FormikProps } from "formik";
import { Theme, useTheme } from "@/contexts/ThemeContext";
import { ErrorText } from "@/components/form/ErrorText";
import { fieldStyle } from "@/components/form/fieldStyle";

type FieldProps<Values extends Record<string, string | number>> = {
  formik: FormikProps<Values>;
  name: Extract<keyof Values, string>;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  min?: number;
  step?: number;
  width?: number;
};

export function TextField<Values extends Record<string, string | number>>({
  formik,
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
  min,
  step,
  width,
}: FieldProps<Values>) {
  const dark = useTheme().theme === Theme.DARK;
  const meta = formik.getFieldMeta(name);
  const error = meta.touched && typeof meta.error === "string" ? meta.error : undefined;

  return (
    <label style={{ display: "grid", gap: 6 }}>
      {label}
      <input
        name={name}
        type={type}
        value={formik.values[name]}
        autoComplete={autoComplete}
        placeholder={placeholder}
        min={min}
        step={step}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        style={{ ...fieldStyle(dark), width: width ?? "100%" }}
      />
      <ErrorText message={error} />
    </label>
  );
}
