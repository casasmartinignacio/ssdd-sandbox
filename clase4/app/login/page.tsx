"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
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
        <h1 style={{ margin: 0 }}>Entrar</h1>
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
            autoComplete="current-password"
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
          Entrar
        </button>
        <Link href="/registro" style={{ color: "#231c14" }}>
          Crear cuenta
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
