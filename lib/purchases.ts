import type { CustomerDetails } from "@/lib/customer";
import { PRODUCT } from "@/lib/product";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export class PurchaseRecordError extends Error {
  constructor() {
    super("Purchase could not be recorded");
    this.name = "PurchaseRecordError";
  }
}

type RecordedPurchase = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  payment_status: string;
};

function isUniqueViolation(error: { code?: string }): boolean {
  return error.code === "23505";
}

export async function recordVerifiedPurchase(input: {
  customer: CustomerDetails;
  razorpayOrderId: string;
  razorpayPaymentId: string;
}): Promise<void> {
  const supabase = getSupabaseServerClient();
  const row = {
    customer_name: input.customer.name,
    customer_email: input.customer.email,
    company_name: input.customer.company || null,
    marketing_consent: input.customer.marketingConsent,
    product_id: PRODUCT.id,
    product_name: PRODUCT.name,
    razorpay_order_id: input.razorpayOrderId,
    razorpay_payment_id: input.razorpayPaymentId,
    amount: PRODUCT.amountPaise,
    currency: PRODUCT.currency,
    payment_status: "verified",
  };

  const { error } = await supabase.from("purchases").insert(row);

  if (!error) {
    return;
  }

  if (!isUniqueViolation(error)) {
    throw new PurchaseRecordError();
  }

  const { data, error: lookupError } = await supabase
    .from("purchases")
    .select("razorpay_order_id, razorpay_payment_id, payment_status")
    .eq("razorpay_order_id", input.razorpayOrderId)
    .eq("razorpay_payment_id", input.razorpayPaymentId)
    .maybeSingle<RecordedPurchase>();

  if (
    lookupError ||
    !data ||
    data.payment_status !== "verified" ||
    data.razorpay_order_id !== input.razorpayOrderId ||
    data.razorpay_payment_id !== input.razorpayPaymentId
  ) {
    throw new PurchaseRecordError();
  }
}

export type BuyerPurchase = {
  productId: string;
  productName: string;
  amount: number;
  currency: string;
  purchasedAt: string | null;
  emailVerified: boolean;
};

export class PurchaseLookupError extends Error {
  constructor() {
    super("Purchases could not be loaded");
    this.name = "PurchaseLookupError";
  }
}

export async function getVerifiedPurchasesForEmail(email: string): Promise<BuyerPurchase[]> {
  const supabase = getSupabaseServerClient();
  const query = supabase
    .from("purchases")
    .select("product_id, product_name, amount, currency, created_at, payment_status, email_verified_at")
    .eq("customer_email", email)
    .eq("payment_status", "verified")
    .eq("product_id", PRODUCT.id);

  const { data, error } = await query;

  if (!error) {
    return (data ?? []).map((row) => ({
      productId: String(row.product_id),
      productName: String(row.product_name),
      amount: Number(row.amount),
      currency: String(row.currency),
      purchasedAt: typeof row.created_at === "string" ? row.created_at : null,
      emailVerified: Boolean(row.email_verified_at),
    }));
  }

  const fallback = await supabase
    .from("purchases")
    .select("product_id, product_name, amount, currency, created_at, payment_status")
    .eq("customer_email", email)
    .eq("payment_status", "verified")
    .eq("product_id", PRODUCT.id);

  if (fallback.error) {
    throw new PurchaseLookupError();
  }

  return (fallback.data ?? []).map((row) => ({
    productId: String(row.product_id),
    productName: String(row.product_name),
    amount: Number(row.amount),
    currency: String(row.currency),
    purchasedAt: typeof row.created_at === "string" ? row.created_at : null,
    emailVerified: false,
  }));
}

export async function hasVerifiedProductPurchase(email: string): Promise<boolean> {
  const purchases = await getVerifiedPurchasesForEmail(email);
  return purchases.length > 0;
}

function isMissingEmailVerifiedColumn(error: { code?: string; message?: string }): boolean {
  const message = error.message ?? "";
  return error.code === "42703" || error.code === "PGRST204" || message.includes("email_verified_at");
}

type ClaimedPurchase = {
  customer_email: string;
  emailVerified: boolean;
};

export async function getClaimBoundPurchase(input: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  email: string;
}): Promise<ClaimedPurchase | null> {
  const supabase = getSupabaseServerClient();
  const withVerifiedAt = await supabase
    .from("purchases")
    .select("customer_email, payment_status, razorpay_order_id, razorpay_payment_id, email_verified_at")
    .eq("razorpay_order_id", input.razorpayOrderId)
    .eq("razorpay_payment_id", input.razorpayPaymentId)
    .eq("payment_status", "verified")
    .maybeSingle<{
      customer_email: string;
      email_verified_at: string | null;
    }>();

  if (!withVerifiedAt.error && withVerifiedAt.data) {
    if (withVerifiedAt.data.customer_email !== input.email) {
      return null;
    }
    return {
      customer_email: withVerifiedAt.data.customer_email,
      emailVerified: Boolean(withVerifiedAt.data.email_verified_at),
    };
  }

  const fallback = await supabase
    .from("purchases")
    .select("customer_email, payment_status, razorpay_order_id, razorpay_payment_id")
    .eq("razorpay_order_id", input.razorpayOrderId)
    .eq("razorpay_payment_id", input.razorpayPaymentId)
    .eq("payment_status", "verified")
    .maybeSingle<{ customer_email: string }>();

  if (fallback.error || !fallback.data || fallback.data.customer_email !== input.email) {
    return null;
  }

  return { customer_email: fallback.data.customer_email, emailVerified: false };
}

export async function markPurchaseEmailVerified(email: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  const verifiedAt = new Date().toISOString();
  const { error } = await supabase
    .from("purchases")
    .update({ email_verified_at: verifiedAt })
    .eq("customer_email", email)
    .eq("payment_status", "verified")
    .eq("product_id", PRODUCT.id);

  if (error && !isMissingEmailVerifiedColumn(error)) {
    throw new PurchaseRecordError();
  }
}

export async function updateClaimBoundPurchaseEmail(input: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  currentEmail: string;
  nextEmail: string;
}): Promise<void> {
  const supabase = getSupabaseServerClient();
  const verifiedAt = new Date().toISOString();
  const { error } = await supabase
    .from("purchases")
    .update({ customer_email: input.nextEmail, email_verified_at: verifiedAt })
    .eq("razorpay_order_id", input.razorpayOrderId)
    .eq("razorpay_payment_id", input.razorpayPaymentId)
    .eq("payment_status", "verified")
    .eq("customer_email", input.currentEmail);

  if (!error) {
    return;
  }

  if (!isMissingEmailVerifiedColumn(error)) {
    throw new PurchaseRecordError();
  }

  const { error: fallbackError } = await supabase
    .from("purchases")
    .update({ customer_email: input.nextEmail })
    .eq("razorpay_order_id", input.razorpayOrderId)
    .eq("razorpay_payment_id", input.razorpayPaymentId)
    .eq("payment_status", "verified")
    .eq("customer_email", input.currentEmail);

  if (fallbackError) {
    throw new PurchaseRecordError();
  }
}
