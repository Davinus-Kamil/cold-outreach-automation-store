import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { CheckoutShell } from "@/components/purchase/CheckoutShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Cold Outreach Automation System",
  description:
    "A ready-to-deploy n8n package that researches prospects, personalizes outreach, sends email, follows up, and detects replies from your lead sheet.",
  icons: {
    icon: [{ url: "/brand/favicon.png", type: "image/png" }],
    shortcut: "/brand/favicon.png",
    apple: [{ url: "/brand/favicon.png", type: "image/png" }],
  },
  openGraph: {
    title: "Cold Outreach Automation System",
    description:
      "Turn a lead list into personalized outreach without researching, writing, and following up by hand.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[#08090d] font-sans text-[#f4f5f7] antialiased`}>
        <CheckoutShell>{children}</CheckoutShell>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
