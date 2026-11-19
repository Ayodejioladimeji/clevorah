import { brandById, loadStore } from "@/lib/repository";
import { currentSession } from "@/lib/session";

export default async function ClicksPage() {
  const session = await currentSession();
  if (!session) return null;
  const store = await loadStore();
  const groups = new Map<string, { page: string; brand: string; role: string; count: number }>();
  for (const click of store.clicks) {
    const key = `${click.pageSlug}|${click.brandId}|${click.role}`;
    const current = groups.get(key);
    if (current) current.count += 1;
    else {
      groups.set(key, {
        page: click.pageSlug,
        brand: brandById(store, click.brandId)?.name || click.brandId,
        role: click.role,
        count: 1,
      });
    }
  }
  const rows = [...groups.values()].sort((a, b) => b.count - a.count);
  return (
    <div className="grid gap-4">
      <h1>Clicks</h1>
      <p className="meta">Sales stay in the network. Match them with the sub-id on the outbound link.</p>
      {rows.length ? (
        <ul className="record-list">
          {rows.map((row) => (
            <li key={`${row.page}-${row.brand}-${row.role}`}>
              <p>
                {row.count} · {row.brand} · {row.role}
              </p>
              <p className="meta">{row.page}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No clicks yet.</p>
      )}
    </div>
  );
}
