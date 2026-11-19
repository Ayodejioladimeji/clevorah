import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { DisclosureLine } from "@/components/site/DisclosureLine";
import { Paragraphs, Prose } from "@/components/site/Prose";
import { buildMetadata } from "@/lib/seo";
import { loadStore } from "@/lib/repository";

export async function generateMetadata() {
  const store = await loadStore();
  return buildMetadata({ title: "Disclosure", description: store.settings.disclosure, path: "/disclosure" });
}

export default async function DisclosurePage() {
  const store = await loadStore();
  return (
    <Prose kicker="How the links work" title="Disclosure">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Disclosure" }]} />
      <DisclosureLine text={store.settings.disclosure} />
      <Paragraphs text={store.settings.disclosureBody} />
    </Prose>
  );
}
