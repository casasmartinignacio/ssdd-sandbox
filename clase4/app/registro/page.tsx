"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { AuthForm } from "@/components/form/AuthForm";
import { ErrorText } from "@/components/form/ErrorText";
import { SubmitButton } from "@/components/form/SubmitButton";
import { TextField } from "@/components/form/TextField";
import { registerSchema, validateWith, type RegisterValues } from "@/lib/schemas";

export default function RegisterPage() {
  const router = useRouter();
  const formik = useFormik<RegisterValues>({
    initialValues: { name: "", email: "", password: "" },
    validate: validateWith(registerSchema),
    onSubmit: async (values, helpers) => {
      helpers.setStatus("");
      const parsed = registerSchema.parse(values);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        helpers.setStatus(data.message ?? "No se pudo crear la cuenta.");
        return;
      }
      router.push("/");
      router.refresh();
    },
  });

  return (
    <AuthForm title="Crear cuenta" onSubmit={formik.handleSubmit}>
      <TextField formik={formik} name="name" label="Nombre" autoComplete="name" />
      <TextField formik={formik} name="email" label="Email" type="email" autoComplete="email" />
      <TextField
        formik={formik}
        name="password"
        label="Contraseña"
        type="password"
        autoComplete="new-password"
      />
      <ErrorText message={typeof formik.status === "string" ? formik.status : undefined} />
      <SubmitButton>Registrarme</SubmitButton>
      <Link href="/login" style={{ color: "inherit" }}>
        Ya tengo cuenta
      </Link>
    </AuthForm>
  );
}
