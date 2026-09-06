import { NextResponse } from "next/server";
import { sendEmailOtp } from "@/lib/auth-otp";
import { parseEmail } from "@/lib/customer";
import { readPurchaseClaim } from "@/lib/purchase-claim";
import { getClaimBoundPurchase } from "@/lib/purchases";

type OtpBody = {
  claimToken?: unknown;
  email?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OtpBody;
    const claim = readPurchaseClaim(request, body.claimToken);
    if (!claim) {
      return NextResponse.json({ error: "This purchase session has expired. Use My Purchase to sign in." }, { status: 401 });
    }

    const bound = await getClaimBoundPurchase({
      razorpayOrderId: claim.razorpayOrderId,
      razorpayPaymentId: claim.razorpayPaymentId,
      email: claim.email,
    });
    if (!bound) {
      return NextResponse.json({ error: "This purchase session is no longer valid." }, { status: 401 });
    }

    const targetEmail = parseEmail(body.email) ?? claim.email;
    const sent = await sendEmailOtp(targetEmail, request);
    if (!sent) {
      return NextResponse.json({ error: "A verification code could not be sent. Try again shortly." }, { status: 500 });
    }

    return NextResponse.json({ sent: true, email: targetEmail });
  } catch {
    return NextResponse.json({ error: "A verification code could not be sent." }, { status: 400 });
  }
}
