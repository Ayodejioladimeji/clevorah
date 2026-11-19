import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Paragraphs, Prose } from "@/components/site/Prose";
import { buildMetadata } from "@/lib/seo";
import { loadStore } from "@/lib/repository";

export async function generateMetadata() {
  return buildMetadata({
    title: "Privacy",
    description: "How Clevorah stores newsletter emails, contact messages, and clicks.",
    path: "/privacy",
  });
}

export default async function PrivacyPage() {
  const store = await loadStore();
  return (
    <Prose kicker="What is stored" title="Privacy">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Privacy" }]} />
      <Paragraphs text={store.settings.privacyBody} />
    </Prose>
  );
}
