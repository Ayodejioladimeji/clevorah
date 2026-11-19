export const SESSION_COOKIE = "clevorah_session";

const text = new TextEncoder();

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    text.encode(process.env.SESSION_SECRET || ""),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, text.encode(payload));
  return bytesToBase64Url(new Uint8Array(signature));
}

export async function createSessionToken(email: string): Promise<string> {
  const expires = Date.now() + 14 * 24 * 60 * 60 * 1000;
  const payload = `${email}|${expires}`;
  return `${payload}|${await sign(payload)}`;
}

export async function readSessionToken(token: string | undefined): Promise<{ email: string } | null> {
  if (!token) return null;
  const parts = token.split("|");
  if (parts.length !== 3) return null;
  const [email, expires, signature] = parts;
  if (!email || !expires || !signature) return null;
  if (Number(expires) < Date.now()) return null;
  if (email !== process.env.ADMIN_EMAIL) return null;
  const expected = await sign(`${email}|${expires}`);
  if (expected.length !== signature.length) return null;
  let difference = 0;
  for (let index = 0; index < expected.length; index += 1) {
    difference |= expected.charCodeAt(index) ^ signature.charCodeAt(index);
  }
  return difference === 0 ? { email } : null;
}
