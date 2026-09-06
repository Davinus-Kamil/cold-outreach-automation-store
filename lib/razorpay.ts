import crypto from "crypto";
import Razorpay from "razorpay";
import { PRODUCT } from "@/lib/product";

function getKeyId(): string {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId) {
    throw new Error("Razorpay key id is not configured");
  }
  return keyId;
}

function getKeySecret(): string {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error("Razorpay key secret is not configured");
  }
  return secret;
}

export function getRazorpayClient(): Razorpay {
  return new Razorpay({
    key_id: getKeyId(),
    key_secret: getKeySecret(),
  });
}

export function getPublicRazorpayKeyId(): string {
  return getKeyId();
}

export function createReceiptId(): string {
  return `cos_${Date.now().toString(36)}_${crypto.randomBytes(3).toString("hex")}`;
}

export function verifyRazorpaySignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  const payload = `${params.razorpayOrderId}|${params.razorpayPaymentId}`;
  const expected = crypto
    .createHmac("sha256", getKeySecret())
    .update(payload)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(params.razorpaySignature, "utf8");
  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function assertProductOrder(orderId: string): Promise<void> {
  const order = await getRazorpayClient().orders.fetch(orderId);
  const amount = typeof order.amount === "string" ? Number(order.amount) : order.amount;
  const notes = order.notes ?? {};
  const productId = typeof notes.productId === "string" ? notes.productId : "";

  if (
    amount !== PRODUCT.amountPaise ||
    order.currency !== PRODUCT.currency ||
    productId !== PRODUCT.id
  ) {
    throw new Error("Order does not match this product");
  }
}
