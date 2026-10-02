import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/current-user";
import { db } from "@/lib/db";

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const user = await db.findUserById(userId);
  if (!user) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  return NextResponse.json({ name: user.name, email: user.email });
}
