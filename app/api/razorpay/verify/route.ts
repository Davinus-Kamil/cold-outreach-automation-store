import { NextResponse } from "next/server";
import { parseCustomer } from "@/lib/customer";
import { applyPurchaseClaimCookie } from "@/lib/purchase-claim";
import { ProductDeliveryError } from "@/lib/product-download";
import { handleVerifiedPurchase } from "@/lib/purchase";
import { PurchaseRecordError } from "@/lib/purchases";
import { assertProductOrder, verifyRazorpaySignature } from "@/lib/razorpay";

type VerifyBody = {
  razorpay_payment_id?: unknown;
  razorpay_order_id?: unknown;
  razorpay_signature?: unknown;
  customer?: unknown;
};

function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function jsonWithClaim(body: Record<string, unknown>, claimToken?: string, status = 200) {
  const response = NextResponse.json(body, { status });
  if (claimToken) {
    applyPurchaseClaimCookie(response, claimToken);
  }
  return response;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyBody;
    const razorpayPaymentId = readString(body.razorpay_payment_id);
    const razorpayOrderId = readString(body.razorpay_order_id);
    const razorpaySignature = readString(body.razorpay_signature);
    const customer = parseCustomer(body.customer);

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature || !customer) {
      return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
    }

    const signatureOk = verifyRazorpaySignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!signatureOk) {
      return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });
    }

    await assertProductOrder(razorpayOrderId);

    try {
      const result = await handleVerifiedPurchase({ razorpayOrderId, razorpayPaymentId, customer });
      return jsonWithClaim(
        { verified: true, downloadUrl: result.downloadUrl, claimToken: result.claimToken },
        result.claimToken,
      );
    } catch (error) {
      if (error instanceof ProductDeliveryError) {
        const claimToken = typeof (error as ProductDeliveryError & { claimToken?: string }).claimToken === "string"
          ? (error as ProductDeliveryError & { claimToken: string }).claimToken
          : undefined;
        return jsonWithClaim(
          {
            verified: true,
            claimToken,
            fulfilmentError:
              "Your payment was recorded, but the download link could not be created. Please try again shortly.",
          },
          claimToken,
        );
      }

      if (error instanceof PurchaseRecordError) {
        return NextResponse.json(
          {
            error:
              "Your payment was received, but we could not complete your purchase record. Please contact support with your payment ID.",
          },
          { status: 500 },
        );
      }

      return NextResponse.json(
        {
          error:
            "Your payment was received, but we could not complete fulfilment. Please contact support with your payment ID.",
        },
        { status: 500 },
      );
    }
  } catch {
    return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });
  }
}
