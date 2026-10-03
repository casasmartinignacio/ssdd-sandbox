"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, type FormikHelpers } from "formik";
import { AuthForm } from "@/components/form/AuthForm";
import { ErrorText } from "@/components/form/ErrorText";
import { SubmitButton } from "@/components/form/SubmitButton";
import { TextField } from "@/components/form/TextField";
import { useLogin } from "@/hooks/useAuth";
import { loginSchema, validateWith, type LoginValues } from "@/lib/schemas";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();

  async function handleSubmit(values: LoginValues, helpers: FormikHelpers<LoginValues>) {
    helpers.setStatus("");
    try {
      await login.mutateAsync(loginSchema.parse(values));
      router.push("/");
      router.refresh();
    } catch (error) {
      helpers.setStatus(error instanceof Error ? error.message : "No se pudo entrar.");
    }
  }

  return (
    <Formik<LoginValues>
      initialValues={{ email: "", password: "" }}
      validate={validateWith(loginSchema)}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <AuthForm title="Entrar">
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
      )}
    </Formik>
  );
}
