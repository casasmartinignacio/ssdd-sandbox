"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
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
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f4efe6",
        color: "#231c14",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        padding: 24,
      }}
    >
      <form
        noValidate
        onSubmit={formik.handleSubmit}
        style={{
          width: "100%",
          maxWidth: 420,
          display: "grid",
          gap: 14,
          background: "#fffdf8",
          border: "1px solid #e6dccb",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <h1 style={{ margin: 0 }}>Crear cuenta</h1>
        <label style={{ display: "grid", gap: 6 }}>
          Nombre
          <input
            name="name"
            value={formik.values.name}
            autoComplete="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={inputStyle}
          />
          {formik.touched.name && formik.errors.name ? (
            <span style={errorStyle}>{formik.errors.name}</span>
          ) : null}
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          Email
          <input
            name="email"
            type="email"
            value={formik.values.email}
            autoComplete="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={inputStyle}
          />
          {formik.touched.email && formik.errors.email ? (
            <span style={errorStyle}>{formik.errors.email}</span>
          ) : null}
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          Contraseña
          <input
            name="password"
            type="password"
            value={formik.values.password}
            autoComplete="new-password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={inputStyle}
          />
          {formik.touched.password && formik.errors.password ? (
            <span style={errorStyle}>{formik.errors.password}</span>
          ) : null}
        </label>
        {formik.status ? <p style={{ ...errorStyle, margin: 0 }}>{formik.status}</p> : null}
        <button type="submit" style={submitStyle}>
          Registrarme
        </button>
        <Link href="/login" style={{ color: "#231c14" }}>
          Ya tengo cuenta
        </Link>
      </form>
    </main>
  );
}

const inputStyle = {
  border: "1px solid #d9d0c3",
  borderRadius: 10,
  padding: "10px 12px",
  font: "inherit",
};

const submitStyle = {
  border: 0,
  background: "#231c14",
  color: "#fffdf8",
  borderRadius: 10,
  padding: "10px 14px",
  cursor: "pointer",
  font: "inherit",
};

const errorStyle = {
  color: "#8a3b2c",
  fontSize: 14,
};
