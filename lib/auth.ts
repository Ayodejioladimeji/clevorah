import { scryptSync, timingSafeEqual } from "crypto";

const attempts = new Map<string, { count: number; reset: number }>();
let globalFailures = 0;
let globalReset = 0;

export function passwordMatches(input: string): boolean {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash) {
    const [salt, expected] = hash.split(":");
    if (!salt || !expected) return false;
    const actual = scryptSync(input, salt, 64).toString("hex");
    if (actual.length !== expected.length) return false;
    return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
  }
  const password = process.env.ADMIN_PASSWORD || "";
  if (!password || password.length !== input.length) return false;
  return timingSafeEqual(Buffer.from(password), Buffer.from(input));
}

export function loginBlocked(email: string): boolean {
  const now = Date.now();
  if (globalReset < now) {
    globalFailures = 0;
    globalReset = now + 10 * 60 * 1000;
  }
  const current = attempts.get(email.toLowerCase());
  if (!current || current.reset < now) return globalFailures > 30;
  return globalFailures > 30 || current.count >= 5;
}

export function loginFailed(email: string) {
  const now = Date.now();
  globalFailures += 1;
  const key = email.toLowerCase();
  const current = attempts.get(key);
  if (!current || current.reset < now) {
    attempts.set(key, { count: 1, reset: now + 10 * 60 * 1000 });
    return;
  }
  current.count += 1;
}

export function loginSucceeded(email: string) {
  attempts.delete(email.toLowerCase());
}
