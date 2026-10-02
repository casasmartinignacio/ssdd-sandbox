import type { FormikErrors } from "formik";
import { z } from "zod";

const email = z.string().trim().pipe(z.email("Ingresá un email válido."));

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "La contraseña es obligatoria."),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio."),
  email,
  password: z.string().min(6, "La contraseña tiene que tener al menos 6 caracteres."),
});

const minutesMessage = "Los minutos de validez tienen que ser un entero mayor a 0.";

export const noteFormSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio."),
  text: z.string().trim(),
  minutes: z.preprocess((value) => {
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) return parsed;
    }
    return value;
  }, z.number(minutesMessage).int(minutesMessage).min(1, minutesMessage)),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type NoteFormValues = z.infer<typeof noteFormSchema>;

export function validateWith(schema: z.ZodType) {
  return (values: unknown): FormikErrors<Record<string, unknown>> => {
    const result = schema.safeParse(values);
    if (result.success) return {};

    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !errors[field]) errors[field] = issue.message;
    }
    return errors;
  };
}
