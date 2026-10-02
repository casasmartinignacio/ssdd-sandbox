import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkPassword } from "@/lib/password";
import { loginSchema } from "@/lib/schemas";
import { signSession, SESSION_COOKIE } from "@/lib/session";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 },
    );
  }

  const email = parsed.data.email.toLowerCase();
  const user = await db.findUserByEmail(email);
  const valid = user ? await checkPassword(parsed.data.password, user.passwordHash) : false;

  if (!user || !valid) {
    return NextResponse.json({ message: "Email o contraseña incorrectos." }, { status: 401 });
  }

  const response = NextResponse.json({ name: user.name, email: user.email });
  response.cookies.set(SESSION_COOKIE, await signSession(user.id, user.email), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
