import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "session";

export const jwtSecret = new TextEncoder().encode("clase4-secreto-de-desarrollo");

export async function signSession(userId: string, email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(jwtSecret);
}

export async function readSession(token: string) {
  try {
    const { payload } = await jwtVerify(token, jwtSecret);
    return payload;
  } catch {
    return null;
  }
}
