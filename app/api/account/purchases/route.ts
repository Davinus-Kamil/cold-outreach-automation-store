import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { getVerifiedPurchasesForEmail, PurchaseLookupError } from "@/lib/purchases";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  try {
    const purchases = await getVerifiedPurchasesForEmail(user.email);
    return NextResponse.json({ email: user.email, purchases });
  } catch (error) {
    if (error instanceof PurchaseLookupError) {
      return NextResponse.json({ error: "Purchases could not be loaded." }, { status: 500 });
    }
    return NextResponse.json({ error: "Purchases could not be loaded." }, { status: 500 });
  }
}
