export type Note = {
  id: string;
  title: string;
  text: string;
  minutes: number;
  createdAt: number;
  notified: boolean;
};

export function isExpired(note: Note, now: number) {
  return now >= note.createdAt + note.minutes * 60_000;
}
