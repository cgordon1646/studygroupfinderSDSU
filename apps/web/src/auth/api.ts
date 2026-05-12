import type { AuthTokenResponseSnake, UserPublicSnake } from "./types";

const API_ROOT =
  typeof import.meta.env.VITE_API_BASE_URL === "string"
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")
    : "";

function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_ROOT}${p}`;
}

async function extractErrorDetail(res: Response): Promise<string> {
  try {
    const body = await res.clone().json() as unknown;
    if (typeof body === "object" && body !== null && "detail" in body) {
      const detail = (body as { detail: unknown }).detail;
      if (typeof detail === "string") return detail;
      if (Array.isArray(detail)) {
        return detail
          .map((d) =>
            typeof d === "object" && d !== null && "msg" in d
              ? String((d as { msg: unknown }).msg)
              : JSON.stringify(d),
          )
          .join(" ");
      }
    }
  } catch {
    /* ignore */
  }
  return res.statusText || "Request failed";
}

export async function loginRequest(email: string, password: string): Promise<AuthTokenResponseSnake> {
  const res = await fetch(apiUrl("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });
  if (!res.ok) {
    throw new Error(await extractErrorDetail(res));
  }
  return res.json() as Promise<AuthTokenResponseSnake>;
}

export async function registerRequest(payload: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  red_id: string;
  major: string;
  academic_year: string;
}): Promise<AuthTokenResponseSnake> {
  const res = await fetch(apiUrl("/api/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(await extractErrorDetail(res));
  }
  return res.json() as Promise<AuthTokenResponseSnake>;
}

export async function fetchCurrentUser(accessToken: string): Promise<UserPublicSnake | null> {
  const res = await fetch(apiUrl("/api/auth/me"), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  return res.json() as Promise<UserPublicSnake>;
}
