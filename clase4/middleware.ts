import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { jwtSecret, SESSION_COOKIE } from "@/lib/session";

const publicPages = new Set(["/login", "/registro"]);
const publicApis = new Set(["/api/auth/login", "/api/auth/register", "/api/auth/logout"]);

async function hasSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, jwtSecret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const signedIn = await hasSession(request);

  if (pathname.startsWith("/api/")) {
    if (publicApis.has(pathname)) return NextResponse.next();
    if (!signedIn) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (!signedIn && !publicPages.has(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (signedIn && publicPages.has(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
