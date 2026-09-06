import crypto from "crypto";
import { NextResponse } from "next/server";

export const PURCHASE_CLAIM_COOKIE = "cos_purchase_claim";
export const PURCHASE_CLAIM_TTL_SECONDS = 3600;

export type PurchaseClaim = {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  email: string;
  exp: number;
};

function getClaimSecret(): string {
  const secret = process.env.RAZORPAY_KEY_SECRET || process.env.SUPABASE_SECRET_KEY;
  if (!secret) {
    throw new Error("Purchase claim secret is not configured");
  }
  return crypto.createHmac("sha256", secret).update("purchase-claim-v1").digest("hex");
}

function signPayload(payloadPart: string): string {
  return crypto.createHmac("sha256", getClaimSecret()).update(payloadPart).digest("base64url");
}

export function createPurchaseClaim(input: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  email: string;
}): string {
  const payload = JSON.stringify({
    v: 1,
    o: input.razorpayOrderId,
    p: input.razorpayPaymentId,
    e: input.email,
    exp: Math.floor(Date.now() / 1000) + PURCHASE_CLAIM_TTL_SECONDS,
  });
  const payloadPart = Buffer.from(payload, "utf8").toString("base64url");
  return `${payloadPart}.${signPayload(payloadPart)}`;
}

export function parsePurchaseClaim(token: string): PurchaseClaim | null {
  const trimmed = token.trim();
  const separator = trimmed.lastIndexOf(".");
  if (separator <= 0) {
    return null;
  }

  const payloadPart = trimmed.slice(0, separator);
  const signature = trimmed.slice(separator + 1);
  if (!payloadPart || !signature) {
    return null;
  }

  const expected = signPayload(payloadPart);
  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (receivedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8")) as {
      v?: unknown;
      o?: unknown;
      p?: unknown;
      e?: unknown;
      exp?: unknown;
    };
    if (
      parsed.v !== 1 ||
      typeof parsed.o !== "string" ||
      typeof parsed.p !== "string" ||
      typeof parsed.e !== "string" ||
      typeof parsed.exp !== "number"
    ) {
      return null;
    }
    if (parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return {
      razorpayOrderId: parsed.o,
      razorpayPaymentId: parsed.p,
      email: parsed.e,
      exp: parsed.exp,
    };
  } catch {
    return null;
  }
}

function readCookieToken(request: Request): string | null {
  const header = request.headers.get("cookie");
  if (!header) {
    return null;
  }
  const parts = header.split(";");
  for (const part of parts) {
    const [name, ...rest] = part.trim().split("=");
    if (name === PURCHASE_CLAIM_COOKIE) {
      const value = rest.join("=");
      return value ? decodeURIComponent(value) : null;
    }
  }
  return null;
}

export function listPurchaseClaims(request: Request, bodyToken?: unknown): PurchaseClaim[] {
  const candidates = [readCookieToken(request) ?? "", typeof bodyToken === "string" ? bodyToken : ""];
  const claims: PurchaseClaim[] = [];
  const seen = new Set<string>();

  for (const token of candidates) {
    if (!token) {
      continue;
    }
    const claim = parsePurchaseClaim(token);
    if (!claim) {
      continue;
    }
    const key = `${claim.razorpayOrderId}:${claim.razorpayPaymentId}:${claim.email}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    claims.push(claim);
  }

  return claims;
}

export function readPurchaseClaim(request: Request, bodyToken?: unknown): PurchaseClaim | null {
  return listPurchaseClaims(request, bodyToken)[0] ?? null;
}

export function applyPurchaseClaimCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: PURCHASE_CLAIM_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PURCHASE_CLAIM_TTL_SECONDS,
  });
}
