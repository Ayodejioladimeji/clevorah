import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/affiliate";
import { clusterIsVisible, growIsPublic, loadStore, publishedComparisons } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const store = await loadStore();
  const origin = siteUrl();
  const entries: MetadataRoute.Sitemap = [
    { url: origin, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/launch`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${origin}/about`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${origin}/contact`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${origin}/disclosure`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${origin}/privacy`, changeFrequency: "monthly", priority: 0.3 },
  ];
  for (const topic of store.topics.filter((item) => item.clusterSlug === "launch")) {
    entries.push({ url: `${origin}/launch/${topic.slug}`, changeFrequency: "weekly", priority: 0.7 });
  }
  if (growIsPublic(store)) {
    entries.push({ url: `${origin}/grow`, changeFrequency: "weekly", priority: 0.8 });
    for (const topic of store.topics.filter((item) => item.clusterSlug === "grow")) {
      if (publishedComparisons(store, "grow", topic.slug).length) {
        entries.push({ url: `${origin}/grow/${topic.slug}`, changeFrequency: "weekly", priority: 0.7 });
      }
    }
  }
  for (const item of store.comparisons.filter((comparison) => comparison.status === "published" && clusterIsVisible(store, comparison.clusterSlug))) {
    entries.push({
      url: `${origin}/${item.clusterSlug}/${item.topicSlug}/${item.slug}`,
      lastModified: item.reviewDate || item.originalDate || undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }
  return entries;
}
