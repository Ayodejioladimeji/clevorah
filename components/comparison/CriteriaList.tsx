import type { Criterion } from "@/lib/types";

export function CriteriaList({ items, favorite, alternative }: { items: Criterion[]; favorite: string; alternative: string }) {
  const rows = items.filter((item) => item.label);
  if (!rows.length) return null;
  return (
    <section className="grid gap-4">
      <h2>Compared</h2>
      <div className="overflow-x-auto border border-line bg-card">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-paper">
              <th className="kicker px-5 py-3 font-semibold">Criteria</th>
              <th className="kicker px-5 py-3 font-semibold text-favorite">{favorite}</th>
              <th className="kicker px-5 py-3 font-semibold">{alternative}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-line last:border-b-0">
                <th className="px-5 py-4 align-top text-[16px] font-medium">{row.label}</th>
                <td className="px-5 py-4 align-top">{row.favorite || "—"}</td>
                <td className="px-5 py-4 align-top">{row.alternative || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
