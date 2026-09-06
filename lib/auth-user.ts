import { getSupabaseServerClient } from "@/lib/supabase-server";

export type AuthenticatedUser = {
  id: string;
  email: string;
};

function readBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return null;
  }
  const token = header.slice("Bearer ".length).trim();
  return token || null;
}

export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  const accessToken = readBearerToken(request);
  if (!accessToken) {
    return null;
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser(accessToken);
  const email = data.user?.email?.trim().toLowerCase();

  if (error || !data.user || !email) {
    return null;
  }

  return { id: data.user.id, email };
}

export function getAuthRedirectTo(request: Request): string {
  const originHeader = request.headers.get("origin");
  const origin = originHeader || new URL(request.url).origin;
  return `${origin.replace(/\/$/, "")}/auth/callback`;
}
