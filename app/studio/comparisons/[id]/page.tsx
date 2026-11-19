import Link from "next/link";
import { notFound } from "next/navigation";
import { ComparisonEditor } from "@/components/cms/ComparisonEditor";
import { GenerateDraft } from "@/components/cms/GenerateDraft";
import { adminPath } from "@/lib/affiliate";
import { loadStore } from "@/lib/repository";
import { currentSession } from "@/lib/session";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ generated?: string }> };

export default async function ComparisonEditPage({ params, searchParams }: Props) {
  const session = await currentSession();
  if (!session) return null;
  const { id } = await params;
  const query = await searchParams;
  const store = await loadStore();
  const comparison = store.comparisons.find((item) => item.id === id);
  if (!comparison) notFound();
  return (
    <div className="grid gap-6">
      <p>
        <Link href={`${adminPath()}/comparisons`}>Comparisons</Link>
      </p>
      <h1>{comparison.title}</h1>
      {query.generated ? <p>Draft fields were filled. Review them before publishing.</p> : null}
      <GenerateDraft id={comparison.id} />
      <ComparisonEditor comparison={comparison} brands={store.brands} topics={store.topics} />
    </div>
  );
}
