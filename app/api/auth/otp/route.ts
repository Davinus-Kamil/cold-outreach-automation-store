import { NextResponse } from "next/server";
import { parseEmail } from "@/lib/customer";
import { sendEmailOtp } from "@/lib/auth-otp";

type OtpBody = {
  email?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OtpBody;
    const email = parseEmail(body.email);

    if (!email) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const sent = await sendEmailOtp(email, request);
    if (!sent) {
      return NextResponse.json({ error: "A sign-in code could not be sent. Try again shortly." }, { status: 500 });
    }

    return NextResponse.json({ sent: true });
  } catch {
    return NextResponse.json({ error: "A sign-in code could not be sent." }, { status: 400 });
  }
}
