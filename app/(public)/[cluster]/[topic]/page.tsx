import { notFound } from "next/navigation";
import { ArticleList } from "@/components/site/ArticleList";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { AUDIENCE_LABEL, PAGE_TYPE_LABEL } from "@/lib/types";
import { clusterBySlug, clusterIsVisible, loadStore, publishedComparisons, topicBySlug } from "@/lib/repository";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ cluster: string; topic: string }> };

export async function generateMetadata({ params }: Props) {
  const { cluster, topic } = await params;
  const store = await loadStore();
  const doc = topicBySlug(store, cluster, topic);
  if (!doc || !clusterIsVisible(store, cluster)) return { title: "Page not found" };
  return buildMetadata({ title: doc.title, description: doc.description, path: `/${cluster}/${topic}` });
}

export default async function TopicPage({ params }: Props) {
  const { cluster, topic } = await params;
  const store = await loadStore();
  const clusterDoc = clusterBySlug(store, cluster);
  const doc = topicBySlug(store, cluster, topic);
  if (!clusterDoc || !doc || !clusterIsVisible(store, cluster)) notFound();
  const articles = publishedComparisons(store, cluster, topic);
  return (
    <>
      <PageHeader kicker={clusterDoc.title} title={doc.title} lede={doc.description}>
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: `/${cluster}`, label: clusterDoc.title },
            { label: doc.title },
          ]}
        />
      </PageHeader>
      <div className="frame py-12">
        {articles.length ? (
          <ArticleList
            items={articles.map((item) => ({
              href: `/${item.clusterSlug}/${item.topicSlug}/${item.slug}`,
              title: item.title,
              description: item.metaDescription || item.verdict,
              kicker: `${PAGE_TYPE_LABEL[item.pageType]} · ${AUDIENCE_LABEL[item.audience]}`,
            }))}
          />
        ) : (
          <EmptyState
            title="This category is being checked."
            body="Comparisons appear here after a first-hand note is added and the page is published."
            href={`/${cluster}`}
            action={`Back to ${clusterDoc.title}`}
          />
        )}
      </div>
    </>
  );
}
