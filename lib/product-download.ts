import { PRODUCT_STORAGE } from "@/lib/product";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export class ProductDeliveryError extends Error {
  constructor() {
    super("Product download is unavailable");
    this.name = "ProductDeliveryError";
  }
}

export async function createPrivateProductSignedUrl(): Promise<string> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from(PRODUCT_STORAGE.bucket)
    .createSignedUrl(PRODUCT_STORAGE.path, PRODUCT_STORAGE.signedUrlExpirySeconds);

  if (error || !data.signedUrl) {
    throw new ProductDeliveryError();
  }

  return data.signedUrl;
}
