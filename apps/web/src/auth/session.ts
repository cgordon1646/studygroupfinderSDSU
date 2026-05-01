import { fetchCurrentUser, loginRequest, registerRequest } from "./api";
import { isAccessTokenExpired } from "./jwt-utils";
import type { AuthTokenResponseSnake, UserPublicSnake } from "./types";

export const AUTH_TOKEN_KEY = "authToken";

/** Normalizes email locally (server also validates @sdsu.edu on register). */
export function normalizeAccountEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function applyUserSnake(user: UserPublicSnake): void {
  localStorage.setItem("userEmail", user.email);
  localStorage.setItem(
    "userName",
    `${user.first_name} ${user.last_name}`.trim(),
  );
  if (user.red_id) localStorage.setItem("userRedId", user.red_id);
  else localStorage.removeItem("userRedId");
  localStorage.setItem("userMajor", user.major);
  localStorage.setItem("userYear", user.academic_year);
}

/** Persists JWT + mirrored profile fields used by Landing / ClassBrowser. */
export function applyAuthPayload(data: AuthTokenResponseSnake): void {
  localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
  localStorage.setItem("isAuthenticated", "true");
  applyUserSnake(data.user);
}

export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  localStorage.removeItem("userMajor");
  localStorage.removeItem("userYear");
  localStorage.removeItem("userRedId");
  try {
    localStorage.removeItem("sgf_registered_accounts");
  } catch {
    /* ignore */
  }
}

export function tokenIsAuthenticated(): boolean {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return Boolean(token && !isAccessTokenExpired(token));
}

/** Drop expired JWT and legacy keys so UI matches server state. */
export function reconcileExpiredAuth(): void {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token && isAccessTokenExpired(token)) clearStoredAuth();
}

export async function syncProfileIfAuthenticated(): Promise<void> {
  reconcileExpiredAuth();
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token || isAccessTokenExpired(token)) return;
  const user = await fetchCurrentUser(token);
  if (!user) {
    clearStoredAuth();
    return;
  }
  applyUserSnake(user);
}

export async function signIn(email: string, password: string): Promise<void> {
  const payload = await loginRequest(email, password);
  applyAuthPayload(payload);
}

export async function signUp(body: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  red_id: string;
}): Promise<void> {
  const payload = await registerRequest(body);
  applyAuthPayload(payload);
}
