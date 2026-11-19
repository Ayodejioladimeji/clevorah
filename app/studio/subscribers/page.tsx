import { formatDate } from "@/lib/format";
import { loadStore } from "@/lib/repository";
import { currentSession } from "@/lib/session";

export default async function SubscribersPage() {
  const session = await currentSession();
  if (!session) return null;
  const store = await loadStore();
  const subscribers = [...store.subscribers].reverse();
  return (
    <div className="grid gap-4">
      <h1>Subscribers</h1>
      {subscribers.length ? (
        <ul className="record-list">
          {subscribers.map((item) => (
            <li key={item.id}>
              <p>{item.email}</p>
              <p className="meta">
                {item.status} · {item.sourcePage} · {formatDate(item.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No subscribers yet.</p>
      )}
    </div>
  );
}
