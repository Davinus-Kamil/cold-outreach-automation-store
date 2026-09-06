import { NextResponse } from "next/server";
import { parseOtp, verifyEmailOtp } from "@/lib/auth-otp";
import { parseEmail } from "@/lib/customer";
import { applyPurchaseClaimCookie, createPurchaseClaim, readPurchaseClaim } from "@/lib/purchase-claim";
import {
  getClaimBoundPurchase,
  markPurchaseEmailVerified,
  PurchaseRecordError,
  updateClaimBoundPurchaseEmail,
} from "@/lib/purchases";

type ConfirmBody = {
  claimToken?: unknown;
  email?: unknown;
  token?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ConfirmBody;
    const claim = readPurchaseClaim(request, body.claimToken);
    const otp = parseOtp(body.token);
    const targetEmail = parseEmail(body.email) ?? claim?.email ?? null;

    if (!claim || !otp || !targetEmail) {
      return NextResponse.json(
        { error: !claim ? "This purchase session has expired. Use My Purchase to sign in." : "Enter the 6-digit code from your email." },
        { status: !claim ? 401 : 400 },
      );
    }

    const bound = await getClaimBoundPurchase({
      razorpayOrderId: claim.razorpayOrderId,
      razorpayPaymentId: claim.razorpayPaymentId,
      email: claim.email,
    });
    if (!bound) {
      return NextResponse.json({ error: "This purchase session is no longer valid." }, { status: 401 });
    }

    const session = await verifyEmailOtp(targetEmail, otp);
    if (!session || session.email !== targetEmail) {
      return NextResponse.json({ error: "That code is invalid or has expired." }, { status: 400 });
    }

    if (targetEmail !== claim.email) {
      await updateClaimBoundPurchaseEmail({
        razorpayOrderId: claim.razorpayOrderId,
        razorpayPaymentId: claim.razorpayPaymentId,
        currentEmail: claim.email,
        nextEmail: targetEmail,
      });
    } else {
      await markPurchaseEmailVerified(targetEmail);
    }

    const claimToken = createPurchaseClaim({
      razorpayOrderId: claim.razorpayOrderId,
      razorpayPaymentId: claim.razorpayPaymentId,
      email: targetEmail,
    });

    const response = NextResponse.json({
      verified: true,
      email: targetEmail,
      claimToken,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      expiresIn: session.expiresIn,
    });
    applyPurchaseClaimCookie(response, claimToken);
    return response;
  } catch (error) {
    if (error instanceof PurchaseRecordError) {
      return NextResponse.json({ error: "The purchase email could not be updated. Try again shortly." }, { status: 500 });
    }
    return NextResponse.json({ error: "Email verification could not be completed." }, { status: 400 });
  }
}
