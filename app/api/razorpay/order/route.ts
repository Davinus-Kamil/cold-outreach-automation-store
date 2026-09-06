import { NextResponse } from "next/server";
import { PRODUCT } from "@/lib/product";
import { createReceiptId, getPublicRazorpayKeyId, getRazorpayClient } from "@/lib/razorpay";

export async function POST() {
  try {
    const order = await getRazorpayClient().orders.create({
      amount: PRODUCT.amountPaise,
      currency: PRODUCT.currency,
      receipt: createReceiptId(),
      notes: {
        productId: PRODUCT.id,
        productName: PRODUCT.name,
      },
    });

    const amount = typeof order.amount === "string" ? Number(order.amount) : order.amount;

    if (!order.id || !Number.isFinite(amount) || !order.currency) {
      return NextResponse.json({ error: "Unable to start checkout." }, { status: 500 });
    }

    return NextResponse.json({
      orderId: order.id,
      amount,
      currency: order.currency,
      keyId: getPublicRazorpayKeyId(),
    });
  } catch {
    return NextResponse.json({ error: "Unable to start checkout." }, { status: 500 });
  }
}
