import { headers } from "next/headers";
import Link from "next/link";
import { Menu } from "lucide-react";
import { growIsPublic, loadStore } from "@/lib/repository";

function itemClass(active: boolean) {
  return active ? "border-b-2 border-favorite pb-1 font-medium" : "text-muted hover:text-ink";
}

export async function SiteHeader() {
  const store = await loadStore();
  const path = (await headers()).get("x-pathname") || "/";
  const showGrow = growIsPublic(store);
  const launchTopics = store.topics.filter((topic) => topic.clusterSlug === "launch");
  const growTopics = showGrow ? store.topics.filter((topic) => topic.clusterSlug === "grow") : [];
  const sections = [
    { href: "/launch", label: store.settings.navLaunch },
    ...(showGrow ? [{ href: "/grow", label: store.settings.navGrow }] : []),
    { href: "/about", label: store.settings.navAbout },
    { href: "/contact", label: store.settings.navContact },
  ];

  return (
    <header className="border-b border-line bg-card">
      <div className="frame flex items-center justify-between gap-6 py-4">
        <Link href="/" className="text-[22px] font-semibold tracking-tight">
          Clevorah
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Sections">
          {sections.map((item) => (
            <Link key={item.href} href={item.href} className={itemClass(path === item.href || path.startsWith(`${item.href}/`))}>
              {item.label}
            </Link>
          ))}
        </nav>
        <details className="site-nav md:hidden">
          <summary className="inline-flex items-center gap-2 border border-line px-3 py-2">
            <Menu size={16} aria-hidden="true" />
            Menu
          </summary>
          <div className="site-nav-panel grid gap-5 border-t border-line py-4">
            <nav className="grid gap-3" aria-label="Sections">
              {sections.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <nav className="grid gap-3" aria-label="Categories">
              {launchTopics.map((topic) => (
                <Link key={topic.slug} href={`/launch/${topic.slug}`} className="meta">
                  {topic.title}
                </Link>
              ))}
            </nav>
          </div>
        </details>
      </div>
      <nav className="hidden border-t border-line md:block" aria-label="Categories">
        <div className="frame flex gap-x-6 overflow-x-auto py-3">
          {launchTopics.map((topic) => {
            const href = `/launch/${topic.slug}`;
            const active = path === href || path.startsWith(`${href}/`);
            return (
              <Link key={topic.slug} href={href} className={`shrink-0 text-[14px] ${itemClass(active)}`}>
                {topic.title}
              </Link>
            );
          })}
          {growTopics.map((topic) => {
            const href = `/grow/${topic.slug}`;
            const active = path === href || path.startsWith(`${href}/`);
            return (
              <Link key={topic.slug} href={href} className={`shrink-0 text-[14px] ${itemClass(active)}`}>
                {topic.title}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
