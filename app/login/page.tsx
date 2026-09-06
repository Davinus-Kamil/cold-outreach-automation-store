import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountChrome } from "@/components/account/AccountChrome";
import { LoginView } from "@/components/account/LoginView";

export const metadata: Metadata = {
  title: "Sign in — Cold Outreach Automation System",
  description: "Access your verified purchase download with an email sign-in code.",
  robots: { index: false, follow: false },
};

function LoginFallback() {
  return (
    <div className="mx-auto w-full max-w-md rounded-[28px] bg-[#11141c] px-8 py-12 text-center">
      <span className="spin-ring mx-auto block" />
      <h1 className="mt-6 text-xl font-semibold">Loading sign-in…</h1>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AccountChrome>
      <Suspense fallback={<LoginFallback />}>
        <LoginView />
      </Suspense>
    </AccountChrome>
  );
}
