import { getAuthRedirectTo } from "@/lib/auth-user";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export function parseOtp(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const token = value.trim();
  return /^\d{6}$/.test(token) ? token : null;
}

export type VerifiedOtpSession = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  email: string;
};

export async function sendEmailOtp(email: string, request: Request): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: getAuthRedirectTo(request),
    },
  });
  return !error;
}

export async function verifyEmailOtp(email: string, token: string): Promise<VerifiedOtpSession | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  const session = data.session;
  const userEmail = data.user?.email?.trim().toLowerCase();

  if (error || !session?.access_token || !session.refresh_token || !userEmail) {
    return null;
  }

  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresIn: session.expires_in,
    email: userEmail,
  };
}
