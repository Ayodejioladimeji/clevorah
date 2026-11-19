import Link from "next/link";
import { ArticleList } from "@/components/site/ArticleList";
import { PageHeader } from "@/components/site/PageHeader";
import { buildMetadata } from "@/lib/seo";
import { loadStore } from "@/lib/repository";

const method = [
  { label: "01", title: "One question", body: "Every page answers a single buying question, such as which host to start with." },
  { label: "02", title: "One favorite", body: "The filled button is the pick. The reason and the limit sit on the same card." },
  { label: "03", title: "One alternative", body: "The outline button is the other serious option, for a different kind of buyer." },
];

export async function generateMetadata() {
  const store = await loadStore();
  return buildMetadata({ title: "Clevorah", description: store.settings.homeIntro, path: "/" });
}

export default async function HomePage() {
  const store = await loadStore();
  const topics = store.topics.filter((topic) => topic.clusterSlug === "launch");
  return (
    <>
      <PageHeader kicker="Clevorah" title="Start the business. Then choose the tools." lede={store.settings.homeIntro} />
      <section className="frame py-12 md:py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2>Launch</h2>
          <Link href="/launch" className="text-[14px] font-medium">
            Open the section
          </Link>
        </div>
        <ArticleList
          variant="index"
          items={topics.map((topic) => ({
            href: `/launch/${topic.slug}`,
            title: topic.title,
            description: topic.description,
          }))}
        />
      </section>
      <section className="border-t border-line bg-card">
        <div className="frame grid md:grid-cols-3">
          {method.map((step, index) => (
            <div key={step.label} className={`py-8 md:px-8 ${index === 0 ? "md:pl-0" : ""} ${index < 2 ? "md:border-r md:border-line" : "md:pr-0"}`}>
              <p className="kicker">{step.label}</p>
              <h2 className="mt-3 text-[22px]">{step.title}</h2>
              <p className="mt-2 max-w-sm">{step.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
