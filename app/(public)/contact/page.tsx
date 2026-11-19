import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactForm } from "@/components/site/ContactForm";
import { Paragraphs, Prose } from "@/components/site/Prose";
import { buildMetadata } from "@/lib/seo";
import { loadStore } from "@/lib/repository";

export async function generateMetadata() {
  const store = await loadStore();
  return buildMetadata({ title: "Contact", description: store.settings.contactIntro, path: "/contact" });
}

export default async function ContactPage() {
  const store = await loadStore();
  return (
    <Prose kicker="Write to the publisher" title="Contact">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Contact" }]} />
      <Paragraphs text={store.settings.contactIntro} />
      <ContactForm />
    </Prose>
  );
}
