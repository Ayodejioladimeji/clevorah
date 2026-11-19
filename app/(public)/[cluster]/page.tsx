import { notFound } from "next/navigation";
import { ArticleList } from "@/components/site/ArticleList";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PageHeader } from "@/components/site/PageHeader";
import { AUDIENCE_LABEL, PAGE_TYPE_LABEL } from "@/lib/types";
import { clusterBySlug, clusterIsVisible, loadStore, publishedComparisons } from "@/lib/repository";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ cluster: string }> };

export async function generateMetadata({ params }: Props) {
  const { cluster } = await params;
  const store = await loadStore();
  const doc = clusterBySlug(store, cluster);
  if (!doc || !clusterIsVisible(store, cluster)) return { title: "Page not found" };
  const description = cluster === "launch" ? store.settings.launchIntro : store.settings.growIntro;
  return buildMetadata({ title: doc.title, description, path: `/${doc.slug}` });
}

export default async function ClusterPage({ params }: Props) {
  const { cluster } = await params;
  const store = await loadStore();
  const doc = clusterBySlug(store, cluster);
  if (!doc || !clusterIsVisible(store, cluster)) notFound();
  const topics = store.topics.filter((topic) => topic.clusterSlug === cluster);
  const articles = publishedComparisons(store, cluster);
  const intro = cluster === "launch" ? store.settings.launchIntro : store.settings.growIntro;
  return (
    <>
      <PageHeader kicker="Section" title={doc.title} lede={intro}>
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: doc.title }]} />
      </PageHeader>
      <div className="frame grid gap-12 py-12">
        <section className="grid gap-4">
          <h2>Categories</h2>
          <ArticleList
            variant="index"
            items={topics.map((topic) => ({
              href: `/${cluster}/${topic.slug}`,
              title: topic.title,
              description: topic.description,
            }))}
          />
        </section>
        {articles.length ? (
          <section className="grid gap-4">
            <h2>Comparisons</h2>
            <ArticleList
              items={articles.map((item) => ({
                href: `/${item.clusterSlug}/${item.topicSlug}/${item.slug}`,
                title: item.title,
                description: item.metaDescription || item.verdict,
                kicker: `${PAGE_TYPE_LABEL[item.pageType]} · ${AUDIENCE_LABEL[item.audience]}`,
              }))}
            />
          </section>
        ) : null}
      </div>
    </>
  );
}
