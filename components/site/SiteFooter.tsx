import { headers } from "next/headers";
import Link from "next/link";
import { loadStore } from "@/lib/repository";
import { DisclosureLine } from "./DisclosureLine";
import { NewsletterForm } from "./NewsletterForm";

export async function SiteFooter() {
  const store = await loadStore();
  const path = (await headers()).get("x-pathname") || "/";
  const topics = store.topics.filter((topic) => topic.clusterSlug === "launch");
  return (
    <footer className="border-t border-line bg-card">
      <div className="frame grid gap-10 py-12 md:grid-cols-12">
        <div className="grid content-start gap-4 md:col-span-5">
          <p className="text-[22px] font-semibold tracking-tight">Clevorah</p>
          <p className="max-w-sm">Published from Nigeria for readers anywhere. Each comparison names one favorite and one alternative.</p>
          <DisclosureLine text={store.settings.disclosure} />
        </div>
        <nav className="grid content-start gap-3 md:col-span-3" aria-label="Categories">
          <p className="kicker">Launch</p>
          {topics.map((topic) => (
            <Link key={topic.slug} href={`/launch/${topic.slug}`}>
              {topic.title}
            </Link>
          ))}
        </nav>
        <div className="grid content-start gap-6 md:col-span-4">
          <nav className="grid gap-3" aria-label="About this site">
            <p className="kicker">Site</p>
            <Link href="/about">{store.settings.navAbout}</Link>
            <Link href="/contact">{store.settings.navContact}</Link>
            <Link href="/disclosure">Disclosure</Link>
            <Link href="/privacy">Privacy</Link>
          </nav>
          <NewsletterForm sourcePage={path} compact />
        </div>
      </div>
    </footer>
  );
}
