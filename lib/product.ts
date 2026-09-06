export const PRODUCT = {
  id: "cold-outreach-automation-system",
  name: "Cold Outreach Automation System",
  priceDisplay: "₹1,999",
  regularPriceDisplay: "₹2,999",
  savingsDisplay: "₹1,000",
  priceInr: 1999,
  amountPaise: 199900,
  currency: "INR",
} as const;

export const CHECKOUT_HASH = "#checkout";

export const PRODUCT_STORAGE = {
  bucket: "paid-products",
  path: "cold-outreach-automation/Cold-Outreach-Automation-System.zip",
  signedUrlExpirySeconds: 600,
} as const;
