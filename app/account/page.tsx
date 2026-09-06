import type { Metadata } from "next";
import { AccountChrome } from "@/components/account/AccountChrome";
import { AccountView } from "@/components/account/AccountView";

export const metadata: Metadata = {
  title: "Your purchase — Cold Outreach Automation System",
  description: "Download your verified Cold Outreach Automation System purchase.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <AccountChrome>
      <AccountView />
    </AccountChrome>
  );
}
