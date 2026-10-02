import { promises as fs } from "fs";
import path from "path";
import type { Note } from "@/lib/notes";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

type StoredNote = Note & { userId: string };

type Database = {
  users: User[];
  notes: StoredNote[];
};

const filePath = path.join(process.cwd(), "data", "db.json");

let chain: Promise<unknown> = Promise.resolve();

async function read(): Promise<Database> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<Database>;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      notes: Array.isArray(parsed.notes) ? parsed.notes : [],
    };
  } catch {
    return { users: [], notes: [] };
  }
}

async function write(data: Database) {
  const temporary = `${filePath}.tmp`;
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(temporary, JSON.stringify(data, null, 2));
  await fs.rename(temporary, filePath);
}

function update<T>(change: (data: Database) => T): Promise<T> {
  const run = chain.then(async () => {
    const data = await read();
    const result = change(data);
    await write(data);
    return result;
  });
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function toPublic(note: StoredNote): Note {
  return {
    id: note.id,
    title: note.title,
    text: note.text,
    minutes: note.minutes,
    createdAt: note.createdAt,
    notified: note.notified,
  };
}

export const db = {
  async findUserByEmail(email: string) {
    const data = await read();
    return data.users.find((user) => user.email === email) ?? null;
  },

  createUser(user: User) {
    return update((data) => {
      if (data.users.some((item) => item.email === user.email)) return null;
      data.users.push(user);
      return user;
    });
  },

  async findUserById(id: string) {
    const data = await read();
    return data.users.find((user) => user.id === id) ?? null;
  },

  async listNotes(userId: string) {
    const data = await read();
    return data.notes
      .filter((note) => note.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(toPublic);
  },

  createNote(note: StoredNote) {
    return update((data) => {
      data.notes.unshift(note);
      return toPublic(note);
    });
  },

  updateNote(
    userId: string,
    id: string,
    values: { title: string; text: string; minutes: number },
  ) {
    return update((data) => {
      const note = data.notes.find((item) => item.id === id && item.userId === userId);
      if (!note) return null;
      note.title = values.title;
      note.text = values.text;
      note.minutes = values.minutes;
      note.createdAt = Date.now();
      note.notified = false;
      return toPublic(note);
    });
  },

  markNotified(userId: string, id: string) {
    return update((data) => {
      const note = data.notes.find((item) => item.id === id && item.userId === userId);
      if (!note) return null;
      note.notified = true;
      return toPublic(note);
    });
  },

  deleteNote(userId: string, id: string) {
    return update((data) => {
      const index = data.notes.findIndex((item) => item.id === id && item.userId === userId);
      if (index === -1) return false;
      data.notes.splice(index, 1);
      return true;
    });
  },
};
