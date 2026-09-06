export const AUTH_SESSION_KEY = "cos-auth-session";

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  email: string;
  expiresAt: number;
};

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const data = value as Record<string, unknown>;
  return (
    typeof data.accessToken === "string" &&
    data.accessToken.length > 0 &&
    typeof data.refreshToken === "string" &&
    data.refreshToken.length > 0 &&
    typeof data.email === "string" &&
    data.email.length > 0 &&
    typeof data.expiresAt === "number"
  );
}

export function readAuthSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as unknown;
    return isAuthSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function storeAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

export function sessionFromTokens(input: {
  accessToken: string;
  refreshToken: string;
  email: string;
  expiresIn: number;
}): AuthSession {
  return {
    accessToken: input.accessToken,
    refreshToken: input.refreshToken,
    email: input.email,
    expiresAt: Date.now() + Math.max(input.expiresIn - 30, 0) * 1000,
  };
}
