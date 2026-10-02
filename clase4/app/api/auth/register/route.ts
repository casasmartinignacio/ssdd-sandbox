import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/schemas";
import { signSession, SESSION_COOKIE } from "@/lib/session";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 },
    );
  }

  const user = await db.createUser({
    id: crypto.randomUUID(),
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase(),
    passwordHash: await hashPassword(parsed.data.password),
  });

  if (!user) {
    return NextResponse.json({ message: "Ese email ya está registrado." }, { status: 409 });
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
