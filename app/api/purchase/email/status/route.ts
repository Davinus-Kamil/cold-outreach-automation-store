import { NextResponse } from "next/server";
import { listPurchaseClaims } from "@/lib/purchase-claim";
import { getClaimBoundPurchase } from "@/lib/purchases";

type StatusBody = {
  claimToken?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as StatusBody;
    const claims = listPurchaseClaims(request, body.claimToken);

    for (const claim of claims) {
      const bound = await getClaimBoundPurchase({
        razorpayOrderId: claim.razorpayOrderId,
        razorpayPaymentId: claim.razorpayPaymentId,
        email: claim.email,
      });
      if (bound) {
        return NextResponse.json({
          email: bound.customer_email,
          emailVerified: bound.emailVerified,
        });
      }
    }

    return NextResponse.json({ emailVerified: false }, { status: 200 });
  } catch {
    return NextResponse.json({ emailVerified: false }, { status: 200 });
  }
}
