import { DISCLOSURE } from "@/lib/types";

export function DisclosureLine({ text }: { text?: string }) {
  return <p className="border border-line bg-paper px-3 py-2 text-[14px] leading-snug text-muted">{text || DISCLOSURE}</p>;
}
