export type Note = {
  id: string;
  title: string;
  text: string;
  minutes: number;
  createdAt: number;
  notified: boolean;
};

export const STORAGE_KEY = "clase3-notas";

export function parseStoredNotes(raw: string | null): Note[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const note = item as Partial<Note>;
      if (
        typeof note.id !== "string" ||
        typeof note.title !== "string" ||
        typeof note.text !== "string" ||
        typeof note.minutes !== "number" ||
        typeof note.createdAt !== "number" ||
        typeof note.notified !== "boolean"
      ) {
        return [];
      }

      return [
        {
          id: note.id,
          title: note.title,
          text: note.text,
          minutes: note.minutes,
          createdAt: note.createdAt,
          notified: note.notified,
        },
      ];
    });
  } catch {
    return [];
  }
}

export function expiresAt(note: Note) {
  return note.createdAt + note.minutes * 60_000;
}

export function isExpired(note: Note, now: number) {
  return now >= expiresAt(note);
}
