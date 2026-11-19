import Link from "next/link";
import { createComparison } from "@/lib/actions";
import { adminPath } from "@/lib/affiliate";
import { loadStore } from "@/lib/repository";
import { currentSession } from "@/lib/session";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

export default async function ComparisonsPage() {
  const session = await currentSession();
  if (!session) return null;
  const store = await loadStore();
  const base = adminPath();
  return (
    <div className="grid gap-6">
      <h1>Comparisons</h1>
      <form action={createComparison} className="grid gap-3 border border-line bg-card p-4">
        <h2>New comparison</h2>
        <TextField label="Title" name="title" required />
        <TextField
          label="Category"
          name="topicSlug"
          defaultValue="domains"
          options={store.topics.map((topic) => ({ value: topic.slug, label: topic.title }))}
        />
        <Button type="submit">Create draft</Button>
      </form>
      <ul className="record-list">
        {store.comparisons.map((item) => (
          <li key={item.id}>
            <Link href={`${base}/comparisons/${item.id}`}>
              <h3>{item.title}</h3>
              <p className="meta">
                {item.status} · /{item.clusterSlug}/{item.topicSlug}/{item.slug}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
