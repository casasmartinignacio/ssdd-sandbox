"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { AuthForm } from "@/components/form/AuthForm";
import { ErrorText } from "@/components/form/ErrorText";
import { SubmitButton } from "@/components/form/SubmitButton";
import { TextField } from "@/components/form/TextField";
import { loginSchema, validateWith, type LoginValues } from "@/lib/schemas";

export default function LoginPage() {
  const router = useRouter();
  const formik = useFormik<LoginValues>({
    initialValues: { email: "", password: "" },
    validate: validateWith(loginSchema),
    onSubmit: async (values, helpers) => {
      helpers.setStatus("");
      const parsed = loginSchema.parse(values);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        helpers.setStatus(data.message ?? "No se pudo entrar.");
        return;
      }
      router.push("/");
      router.refresh();
    },
  });

  return (
    <AuthForm title="Entrar" onSubmit={formik.handleSubmit}>
      <TextField formik={formik} name="email" label="Email" type="email" autoComplete="email" />
      <TextField
        formik={formik}
        name="password"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
      />
      <ErrorText message={typeof formik.status === "string" ? formik.status : undefined} />
      <SubmitButton>Entrar</SubmitButton>
      <Link href="/registro" style={{ color: "inherit" }}>
        Crear cuenta
      </Link>
    </AuthForm>
  );
}
