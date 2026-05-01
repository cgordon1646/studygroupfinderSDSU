/** Client-side JWT exp check only; server verifies signature on /auth/me. */
export function isAccessTokenExpired(token: string | null): boolean {
  if (!token) return true;
  const ms = readJwtExpiryMs(token);
  if (ms === null) return true;
  return Date.now() >= ms - 30_000;
}

export function readJwtExpiryMs(token: string): number | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const json = JSON.parse(
      globalThis.atob(part.replace(/-/g, "+").replace(/_/g, "/")),
    ) as { exp?: number };
    if (typeof json.exp !== "number") return null;
    return json.exp * 1000;
  } catch {
    return null;
  }
}
