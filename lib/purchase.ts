import type { CustomerDetails } from "@/lib/customer";
import { createPurchaseClaim } from "@/lib/purchase-claim";
import { createPrivateProductSignedUrl, ProductDeliveryError } from "@/lib/product-download";
import { recordVerifiedPurchase } from "@/lib/purchases";

export type VerifiedPurchase = {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  customer: CustomerDetails;
};

export type FulfilledPurchase = {
  claimToken: string;
  downloadUrl: string;
};

export async function handleVerifiedPurchase(purchase: VerifiedPurchase): Promise<FulfilledPurchase> {
  if (!purchase.razorpayOrderId || !purchase.razorpayPaymentId || !purchase.customer.email) {
    throw new Error("Incomplete verified purchase");
  }

  await recordVerifiedPurchase({
    customer: purchase.customer,
    razorpayOrderId: purchase.razorpayOrderId,
    razorpayPaymentId: purchase.razorpayPaymentId,
  });

  const claimToken = createPurchaseClaim({
    razorpayOrderId: purchase.razorpayOrderId,
    razorpayPaymentId: purchase.razorpayPaymentId,
    email: purchase.customer.email,
  });

  try {
    const downloadUrl = await createPrivateProductSignedUrl();
    return { downloadUrl, claimToken };
  } catch (error) {
    if (error instanceof ProductDeliveryError) {
      const deliveryError = new ProductDeliveryError();
      Object.assign(deliveryError, { claimToken });
      throw deliveryError;
    }
    throw error;
  }
}
