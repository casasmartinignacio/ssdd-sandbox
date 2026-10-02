import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/current-user";
import { db } from "@/lib/db";
import { noteFormSchema } from "@/lib/schemas";

type NoteBody = {
  id?: string;
  title?: string;
  text?: string;
  minutes?: number | string;
  notified?: boolean;
};

function readNote(body: NoteBody) {
  const parsed = noteFormSchema.safeParse({
    title: typeof body.title === "string" ? body.title : "",
    text: typeof body.text === "string" ? body.text : "",
    minutes: body.minutes == null ? "" : String(body.minutes),
  });
  if (!parsed.success) return null;
  return parsed.data;
}

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  return NextResponse.json({ notes: await db.listNotes(userId) });
}

export async function POST(request: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const values = readNote((await request.json()) as NoteBody);
  if (!values) return NextResponse.json({ message: "Datos inválidos" }, { status: 400 });

  const note = await db.createNote({
    id: crypto.randomUUID(),
    userId,
    ...values,
    createdAt: Date.now(),
    notified: false,
  });
  return NextResponse.json({ note }, { status: 201 });
}

export async function PATCH(request: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const body = (await request.json()) as NoteBody;
  if (!body.id) return NextResponse.json({ message: "Falta el id" }, { status: 400 });

  if (body.notified === true) {
    const note = await db.markNotified(userId, body.id);
    if (!note) return NextResponse.json({ message: "Nota no encontrada" }, { status: 404 });
    return NextResponse.json({ note });
  }

  const values = readNote(body);
  if (!values) return NextResponse.json({ message: "Datos inválidos" }, { status: 400 });

  const note = await db.updateNote(userId, body.id, values);
  if (!note) return NextResponse.json({ message: "Nota no encontrada" }, { status: 404 });
  return NextResponse.json({ note });
}

export async function DELETE(request: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ message: "Falta el id" }, { status: 400 });

  const deleted = await db.deleteNote(userId, id);
  if (!deleted) return NextResponse.json({ message: "Nota no encontrada" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
