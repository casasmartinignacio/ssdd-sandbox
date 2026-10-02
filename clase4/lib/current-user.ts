import { cookies } from "next/headers";
import { readSession, SESSION_COOKIE } from "@/lib/session";

export async function currentUserId() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await readSession(token);
  return typeof session?.sub === "string" ? session.sub : null;
}
