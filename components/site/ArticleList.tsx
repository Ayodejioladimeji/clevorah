import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type ArticleListItem = {
  href: string;
  title: string;
  description: string;
  kicker?: string;
};

export function ArticleList({
  items,
  variant = "rows",
}: {
  items: ArticleListItem[];
  variant?: "index" | "rows";
}) {
  if (!items.length) return null;
  if (variant === "index") {
    return (
      <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <li key={item.href} className="bg-card">
            <Link href={item.href} className="flex h-full flex-col gap-4 p-6 hover:bg-paper">
              <span className="kicker">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              {item.description ? <p className="meta flex-1">{item.description}</p> : null}
              <span className="inline-flex items-center gap-1 text-[14px] font-medium">
                Open
                <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="border border-line bg-card">
      {items.map((item) => (
        <li key={item.href} className="border-b border-line last:border-b-0">
          <Link href={item.href} className="grid gap-2 px-5 py-5 hover:bg-paper md:grid-cols-[1fr_auto] md:items-center">
            <span>
              {item.kicker ? <span className="kicker">{item.kicker}</span> : null}
              <span className="mt-1 block text-[18px] font-semibold">{item.title}</span>
              {item.description ? <span className="meta mt-1 block">{item.description}</span> : null}
            </span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
