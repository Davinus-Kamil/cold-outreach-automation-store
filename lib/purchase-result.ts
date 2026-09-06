export const PURCHASE_RESULT_KEY = "cos-purchase-result";

export type PurchaseResult = {
  email: string;
  downloadUrl: string;
  fulfilmentError: string;
  claimToken: string;
  emailVerified: boolean;
};

export function storePurchaseResult(result: PurchaseResult) {
  sessionStorage.setItem(PURCHASE_RESULT_KEY, JSON.stringify(result));
}

export function readPurchaseResult(): PurchaseResult | null {
  const raw = sessionStorage.getItem(PURCHASE_RESULT_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as PurchaseResult;
    if (!parsed.email) {
      return null;
    }
    return {
      email: parsed.email,
      downloadUrl: typeof parsed.downloadUrl === "string" ? parsed.downloadUrl : "",
      fulfilmentError: typeof parsed.fulfilmentError === "string" ? parsed.fulfilmentError : "",
      claimToken: typeof parsed.claimToken === "string" ? parsed.claimToken : "",
      emailVerified: parsed.emailVerified === true,
    };
  } catch {
    return null;
  }
}
