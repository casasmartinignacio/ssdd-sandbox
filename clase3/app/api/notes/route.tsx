import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import axios from "axios";

const RequestBodySchema = z.object({
  notes: z.array(z.object({
    title: z.string(),
    body: z.string(),
  })),
});

export async function POST(request: NextRequest) {
    try {
    const body = await request.json();
    const parsedBody = RequestBodySchema.safeParse(body);

    if (!body || !parsedBody.success) {
      return NextResponse.json({
        status: 400,
        message: "Notas mal formadas",
      }, { status: 400 });
    }
    
    const pasteRSBody = parsedBody.data.notes
      .map((note) => 
        `${note.title}: ${note.body}`)
      .join(", ");

    const pasteRSResponse = await axios.post("https://paste.rs", pasteRSBody);

    return NextResponse.json({
      status: 200,
      data: pasteRSResponse.data || null,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Error al persistir las notas",
    }, { status: 500 });
  }
}

