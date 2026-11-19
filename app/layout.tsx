import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { siteUrl } from "@/lib/affiliate";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "Clevorah", template: "%s · Clevorah" },
  description: "Comparisons for starting an online business. One favorite and one alternative.",
  verification: process.env.GSC_VERIFICATION ? { google: process.env.GSC_VERIFICATION } : undefined,
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.className}>{children}</body>
    </html>
  );
}
