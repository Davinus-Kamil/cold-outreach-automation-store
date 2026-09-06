import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

type RefreshBody = {
  refreshToken?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RefreshBody;
    const refreshToken = typeof body.refreshToken === "string" ? body.refreshToken.trim() : "";

    if (!refreshToken) {
      return NextResponse.json({ error: "Session could not be refreshed." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    const session = data.session;
    const email = data.user?.email?.trim().toLowerCase() || session?.user.email?.trim().toLowerCase();

    if (error || !session?.access_token || !session.refresh_token || !email) {
      return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });
    }

    return NextResponse.json({
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresIn: session.expires_in,
      email,
    });
  } catch {
    return NextResponse.json({ error: "Session could not be refreshed." }, { status: 400 });
  }
}
