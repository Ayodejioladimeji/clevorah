import type { Metadata } from "next";
import { siteUrl } from "./affiliate";
import type { Author, Comparison } from "./types";

export function buildMetadata(input: { title: string; description: string; path: string }): Metadata {
  const canonical = `${siteUrl()}${input.path}`;
  return {
    title: { absolute: input.title },
    description: input.description,
    alternates: { canonical },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: "Clevorah",
      type: "website",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl()}${item.path}`,
    })),
  };
}

export function buildJsonLd(input: {
  comparison: Comparison;
  author: Author;
  path: string;
  crumbs: { name: string; path: string }[];
  favoriteName: string;
  alternativeName: string;
}) {
  const author = input.author.name
    ? {
        "@type": "Person",
        name: input.author.name,
        url: `${siteUrl()}${input.author.profileUrl || "/about"}`,
      }
    : { "@type": "Organization", name: "Clevorah", url: siteUrl() };
  const blocks: unknown[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: input.comparison.title,
      description: input.comparison.metaDescription || input.comparison.verdict,
      datePublished: input.comparison.originalDate || undefined,
      dateModified: input.comparison.reviewDate || input.comparison.originalDate || undefined,
      author,
      mainEntityOfPage: `${siteUrl()}${input.path}`,
    },
    breadcrumbJsonLd(input.crumbs),
  ];
  if (input.comparison.pageType === "best-of") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: input.favoriteName },
        { "@type": "ListItem", position: 2, name: input.alternativeName },
      ],
    });
  }
  return blocks;
}
