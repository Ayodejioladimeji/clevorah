import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { AlternativeCard, FavoriteCard } from "@/components/comparison/ProductCards";
import { CriteriaList } from "@/components/comparison/CriteriaList";
import { AuthorMeta } from "@/components/site/AuthorMeta";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { AUDIENCE_LABEL, PAGE_TYPE_LABEL, type Cluster, type Comparison, type Store, type Topic } from "@/lib/types";
import {
  brandById,
  clusterBySlug,
  clusterIsVisible,
  findByPreviousSlug,
  findComparison,
  linkableBrand,
  loadStore,
  topicBySlug,
} from "@/lib/repository";
import { buildJsonLd, buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ cluster: string; topic: string; slug: string }> };

type Resolved =
  | { ok: true; store: Store; clusterDoc: Cluster; topicDoc: Topic; comparison: Comparison }
  | { ok: false };

async function resolve(params: Props["params"]): Promise<Resolved> {
  const { cluster, topic, slug } = await params;
  const store = await loadStore();
  const clusterDoc = clusterBySlug(store, cluster);
  const topicDoc = topicBySlug(store, cluster, topic);
  if (!clusterDoc || !topicDoc || !clusterIsVisible(store, cluster)) return { ok: false };
  const comparison = findComparison(store, cluster, topic, slug);
  if (comparison?.status === "published") return { ok: true, store, clusterDoc, topicDoc, comparison };
  const previous = findByPreviousSlug(store, cluster, topic, slug);
  if (previous?.status === "published") {
    permanentRedirect(`/${previous.clusterSlug}/${previous.topicSlug}/${previous.slug}`);
  }
  return { ok: false };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await resolve(params);
  if (!result.ok) return { title: "Page not found", robots: { index: false, follow: false } };
  const path = `/${result.comparison.clusterSlug}/${result.comparison.topicSlug}/${result.comparison.slug}`;
  return buildMetadata({
    title: result.comparison.seoTitle || result.comparison.title,
    description: result.comparison.metaDescription || result.comparison.verdict,
    path,
  });
}

export default async function ComparisonPage({ params }: Props) {
  const result = await resolve(params);
  if (!result.ok) notFound();
  const { store, clusterDoc, topicDoc, comparison } = result;
  const path = `/${comparison.clusterSlug}/${comparison.topicSlug}/${comparison.slug}`;
  const favorite = brandById(store, comparison.favoriteBrandId);
  const alternative = brandById(store, comparison.alternativeBrandId);
  const crumbs = [
    { name: "Home", path: "/", label: "Home", href: "/" },
    { name: clusterDoc.title, path: `/${clusterDoc.slug}`, label: clusterDoc.title, href: `/${clusterDoc.slug}` },
    { name: topicDoc.title, path: `/${clusterDoc.slug}/${topicDoc.slug}`, label: topicDoc.title, href: `/${clusterDoc.slug}/${topicDoc.slug}` },
    { name: comparison.title, path, label: comparison.title },
  ];
  const json = buildJsonLd({
    comparison,
    author: store.author,
    path,
    crumbs: crumbs.map((item) => ({ name: item.name, path: item.path })),
    favoriteName: favorite?.name || "Favorite",
    alternativeName: alternative?.name || "Alternative",
  });
  return (
    <>
      {json.map((block, index) => (
        <JsonLd key={index} data={block} />
      ))}
      <header className="border-b border-line bg-card">
        <div className="frame grid gap-5 py-10 md:py-14">
          <Breadcrumbs items={crumbs.map((item) => ({ label: item.label, href: item.href }))} />
          <div className="flex flex-wrap gap-2">
            <span className="chip">{PAGE_TYPE_LABEL[comparison.pageType]}</span>
            <span className="chip">{AUDIENCE_LABEL[comparison.audience]}</span>
          </div>
          <h1 className="max-w-[40rem]">{comparison.title}</h1>
          <AuthorMeta author={store.author} originalDate={comparison.originalDate} reviewDate={comparison.reviewDate} />
        </div>
      </header>
      <div className="frame grid gap-10 py-10 md:py-14">
        <section className="border-l-4 border-favorite bg-card px-6 py-6 md:px-8">
          <p className="kicker text-favorite">Verdict</p>
          <p className="mt-3 max-w-[40rem] text-[20px] leading-snug">{comparison.verdict}</p>
          {comparison.firstHandNote ? <p className="meta mt-4">Checked: {comparison.firstHandNote}</p> : null}
        </section>
        <div className="grid items-stretch gap-4 lg:grid-cols-2">
          <FavoriteCard
            brandName={favorite?.name || "Favorite"}
            brandId={favorite?.id || comparison.favoriteBrandId}
            body={comparison.whyFavorite}
            skip={comparison.skipFavorite}
            linked={linkableBrand(favorite)}
            pageSlug={path}
            disclosure={store.settings.disclosure}
          />
          <AlternativeCard
            brandName={alternative?.name || "Alternative"}
            brandId={alternative?.id || comparison.alternativeBrandId}
            body={comparison.whenAlternative}
            skip={comparison.skipAlternative}
            linked={linkableBrand(alternative)}
            pageSlug={path}
          />
        </div>
        <CriteriaList items={comparison.criteria} favorite={favorite?.name || "Favorite"} alternative={alternative?.name || "Alternative"} />
        {comparison.answers.length ? (
          <section className="grid gap-4">
            <h2>Questions</h2>
            <dl className="border border-line bg-card">
              {comparison.answers.map((item) => (
                <div key={item.question} className="grid gap-2 border-b border-line px-5 py-5 last:border-b-0 md:grid-cols-[16rem_1fr] md:gap-8">
                  <dt className="font-medium">{item.question}</dt>
                  <dd>{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
        <section className="border border-line bg-card p-6 md:p-8">
          <NewsletterForm sourcePage={path} />
        </section>
      </div>
    </>
  );
}
