import { formatDate } from "@/lib/format";
import { loadStore } from "@/lib/repository";
import { currentSession } from "@/lib/session";

export default async function MessagesPage() {
  const session = await currentSession();
  if (!session) return null;
  const messages = [...(await loadStore()).messages].reverse();
  return (
    <div className="grid gap-4">
      <h1>Messages</h1>
      {messages.length ? (
        <ul className="record-list">
          {messages.map((item) => (
            <li key={item.id}>
              <p>
                {item.name} · {item.email}
              </p>
              <p className="meta">{formatDate(item.createdAt)}</p>
              <p>{item.message}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No messages yet.</p>
      )}
    </div>
  );
}
