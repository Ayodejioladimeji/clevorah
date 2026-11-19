import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/lib/actions";
import { adminPath } from "@/lib/affiliate";
import { LoginForm } from "@/components/cms/LoginForm";
import { Button } from "@/components/ui/Button";
import { currentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Desk",
  robots: { index: false, follow: false },
};

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const session = await currentSession();
  if (!session) return <LoginForm />;
  const base = adminPath();
  const links = [
    ["Overview", base],
    ["Comparisons", `${base}/comparisons`],
    ["Brands", `${base}/brands`],
    ["Clicks", `${base}/clicks`],
    ["Subscribers", `${base}/subscribers`],
    ["Messages", `${base}/messages`],
    ["Site text", `${base}/settings`],
  ];
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-card md:min-h-screen md:border-r md:border-b-0">
        <div className="px-5 py-6">
          <p className="kicker">Desk</p>
          <p className="mt-1 text-[20px] font-semibold tracking-tight">Clevorah</p>
        </div>
        <nav className="grid" aria-label="Desk">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="border-t border-line px-5 py-3 hover:bg-paper">
              {label}
            </Link>
          ))}
        </nav>
        <form action={logout} className="p-5">
          <Button type="submit" variant="outline">
            Log out
          </Button>
        </form>
      </aside>
      <div className="px-5 py-8 md:px-10 md:py-10">{children}</div>
    </div>
  );
}
