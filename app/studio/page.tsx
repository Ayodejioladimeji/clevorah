import { loadStore } from "@/lib/repository";
import { currentSession } from "@/lib/session";

export default async function StudioHome() {
  const session = await currentSession();
  if (!session) return null;
  const store = await loadStore();
  const published = store.comparisons.filter((item) => item.status === "published").length;
  const drafts = store.comparisons.length - published;
  const facts = [
    ["Published", String(published)],
    ["Drafts", String(drafts)],
    ["Clicks", String(store.clicks.length)],
    ["Subscribers", String(store.subscribers.filter((item) => item.status === "confirmed").length)],
    ["Messages", String(store.messages.length)],
    ["Brands", String(store.brands.length)],
  ];
  return (
    <div className="grid gap-6">
      <div>
        <p className="kicker">Overview</p>
        <h1 className="mt-2">Desk</h1>
      </div>
      <dl className="grid gap-px border border-line bg-line sm:grid-cols-2 xl:grid-cols-3">
        {facts.map(([label, value]) => (
          <div key={label} className="bg-card px-5 py-5">
            <dt className="kicker">{label}</dt>
            <dd className="mt-2 text-[32px] font-semibold tracking-tight">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
