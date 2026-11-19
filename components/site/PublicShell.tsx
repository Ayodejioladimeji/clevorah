import type { ReactNode } from "react";
import { ConsentNotice } from "./ConsentNotice";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export async function PublicShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <ConsentNotice />
      <main className="min-h-[60vh]">{children}</main>
      <SiteFooter />
    </>
  );
}
