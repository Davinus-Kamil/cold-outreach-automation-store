import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { createPrivateProductSignedUrl, ProductDeliveryError } from "@/lib/product-download";
import { hasVerifiedProductPurchase, PurchaseLookupError } from "@/lib/purchases";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  try {
    const entitled = await hasVerifiedProductPurchase(user.email);
    if (!entitled) {
      return NextResponse.json({ error: "No verified purchase was found for this email." }, { status: 403 });
    }

    const downloadUrl = await createPrivateProductSignedUrl();
    return NextResponse.json({ downloadUrl });
  } catch (error) {
    if (error instanceof ProductDeliveryError) {
      return NextResponse.json({ error: "A new download link could not be created. Try again shortly." }, { status: 500 });
    }
    if (error instanceof PurchaseLookupError) {
      return NextResponse.json({ error: "Purchase could not be confirmed." }, { status: 500 });
    }
    return NextResponse.json({ error: "A new download link could not be created." }, { status: 500 });
  }
}
