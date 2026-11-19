import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Paragraphs, Prose } from "@/components/site/Prose";
import { buildMetadata } from "@/lib/seo";
import { loadStore } from "@/lib/repository";

export async function generateMetadata() {
  const store = await loadStore();
  return buildMetadata({
    title: "About",
    description: store.author.bio,
    path: "/about",
  });
}

export default async function AboutPage() {
  const store = await loadStore();
  return (
    <Prose kicker="The publisher" title="About">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "About" }]} />
      {store.author.name ? <h2>{store.author.name}</h2> : <p className="meta">Publisher name not set</p>}
      <p>{store.author.bio}</p>
      <Paragraphs text={store.settings.aboutBody} />
    </Prose>
  );
}
