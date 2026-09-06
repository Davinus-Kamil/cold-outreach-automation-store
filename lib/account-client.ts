import {
  clearAuthSession,
  readAuthSession,
  sessionFromTokens,
  storeAuthSession,
  type AuthSession,
} from "@/lib/auth-session";

type TokenResponse = {
  accessToken?: unknown;
  refreshToken?: unknown;
  email?: unknown;
  expiresIn?: unknown;
};

export type AccountPurchase = {
  productId: string;
  productName: string;
  amount: number;
  currency: string;
  purchasedAt: string | null;
  emailVerified: boolean;
};

function readTokenResponse(payload: TokenResponse): AuthSession | null {
  const accessToken = typeof payload.accessToken === "string" ? payload.accessToken : "";
  const refreshToken = typeof payload.refreshToken === "string" ? payload.refreshToken : "";
  const email = typeof payload.email === "string" ? payload.email : "";
  const expiresIn = typeof payload.expiresIn === "number" ? payload.expiresIn : 0;

  if (!accessToken || !refreshToken || !email || expiresIn <= 0) {
    return null;
  }

  return sessionFromTokens({ accessToken, refreshToken, email, expiresIn });
}

async function refreshAuthSession(session: AuthSession): Promise<AuthSession | null> {
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: session.refreshToken }),
  });

  if (!response.ok) {
    clearAuthSession();
    return null;
  }

  const next = readTokenResponse((await response.json()) as TokenResponse);
  if (!next) {
    clearAuthSession();
    return null;
  }

  storeAuthSession(next);
  return next;
}

async function authorizedFetch(path: string, init: RequestInit = {}, allowRefresh = true): Promise<Response> {
  let session = readAuthSession();
  if (!session) {
    return new Response(null, { status: 401 });
  }

  if (session.expiresAt <= Date.now()) {
    session = await refreshAuthSession(session);
    if (!session) {
      return new Response(null, { status: 401 });
    }
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${session.accessToken}`);

  const response = await fetch(path, { ...init, headers });
  if (response.status !== 401 || !allowRefresh) {
    return response;
  }

  const refreshed = await refreshAuthSession(session);
  if (!refreshed) {
    return response;
  }

  headers.set("Authorization", `Bearer ${refreshed.accessToken}`);
  return fetch(path, { ...init, headers });
}

export async function fetchAccountPurchases(): Promise<AccountPurchase[] | null> {
  const response = await authorizedFetch("/api/account/purchases");
  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw new Error("purchases_unavailable");
  }
  const payload = (await response.json()) as { purchases?: AccountPurchase[] };
  return Array.isArray(payload.purchases)
    ? payload.purchases.map((purchase) => ({
        ...purchase,
        emailVerified: purchase.emailVerified === true,
      }))
    : [];
}

export async function requestAccountDownload(): Promise<string> {
  const response = await authorizedFetch("/api/account/download", { method: "POST" });
  if (response.status === 401) {
    throw new Error("unauthenticated");
  }
  const payload = (await response.json()) as { downloadUrl?: unknown; error?: unknown };
  if (!response.ok || typeof payload.downloadUrl !== "string" || !payload.downloadUrl) {
    throw new Error(typeof payload.error === "string" ? payload.error : "download_unavailable");
  }
  return payload.downloadUrl;
}
