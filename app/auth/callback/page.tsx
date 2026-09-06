import type { Metadata } from "next";
import { AccountChrome } from "@/components/account/AccountChrome";
import { AuthCallbackView } from "@/components/account/AuthCallbackView";

export const metadata: Metadata = {
  title: "Completing sign-in — Cold Outreach Automation System",
  robots: { index: false, follow: false },
};

export default function AuthCallbackPage() {
  return (
    <AccountChrome>
      <AuthCallbackView />
    </AccountChrome>
  );
}
