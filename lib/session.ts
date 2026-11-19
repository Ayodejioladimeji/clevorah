import { cookies } from "next/headers";
import { createSessionToken, readSessionToken, SESSION_COOKIE } from "./token";

export async function currentSession() {
  const jar = await cookies();
  return readSessionToken(jar.get(SESSION_COOKIE)?.value);
}

export async function openSession(email: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, await createSessionToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function closeSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
