import { formatDate } from "@/lib/format";
import type { Author } from "@/lib/types";

export function AuthorMeta({
  author,
  originalDate,
  reviewDate,
}: {
  author: Author;
  originalDate: string | null;
  reviewDate: string | null;
}) {
  const facts = [
    { label: "Publisher", value: author.name || "Name not set" },
    originalDate ? { label: "First published", value: formatDate(originalDate) } : null,
    reviewDate ? { label: "Reviewed", value: formatDate(reviewDate) } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));
  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-3">
      {facts.map((fact) => (
        <div key={fact.label}>
          <dt className="kicker">{fact.label}</dt>
          <dd className="mt-1">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
