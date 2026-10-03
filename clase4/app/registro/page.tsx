"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, type FormikHelpers } from "formik";
import { AuthForm } from "@/components/form/AuthForm";
import { ErrorText } from "@/components/form/ErrorText";
import { SubmitButton } from "@/components/form/SubmitButton";
import { TextField } from "@/components/form/TextField";
import { useRegister } from "@/hooks/useAuth";
import { registerSchema, validateWith, type RegisterValues } from "@/lib/schemas";

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegister();

  async function handleSubmit(values: RegisterValues, helpers: FormikHelpers<RegisterValues>) {
    helpers.setStatus("");
    try {
      await register.mutateAsync(registerSchema.parse(values));
      router.push("/");
      router.refresh();
    } catch (error) {
      helpers.setStatus(error instanceof Error ? error.message : "No se pudo crear la cuenta.");
    }
  }

  return (
    <Formik<RegisterValues>
      initialValues={{ name: "", email: "", password: "" }}
      validate={validateWith(registerSchema)}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <AuthForm title="Crear cuenta">
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
      )}
    </Formik>
  );
}
