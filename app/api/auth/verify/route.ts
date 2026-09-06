import { NextResponse } from "next/server";
import { parseEmail } from "@/lib/customer";
import { parseOtp, verifyEmailOtp } from "@/lib/auth-otp";
import { markPurchaseEmailVerified, PurchaseRecordError } from "@/lib/purchases";

type VerifyBody = {
  email?: unknown;
  token?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyBody;
    const email = parseEmail(body.email);
    const token = parseOtp(body.token);

    if (!email || !token) {
      return NextResponse.json({ error: "Enter the 6-digit code from your email." }, { status: 400 });
    }

    const session = await verifyEmailOtp(email, token);
    if (!session) {
      return NextResponse.json({ error: "That code is invalid or has expired." }, { status: 400 });
    }

    try {
      await markPurchaseEmailVerified(session.email);
    } catch (error) {
      if (!(error instanceof PurchaseRecordError)) {
        throw error;
      }
    }

    return NextResponse.json({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      expiresIn: session.expiresIn,
      email: session.email,
    });
  } catch {
    return NextResponse.json({ error: "Sign-in could not be completed." }, { status: 400 });
  }
}
