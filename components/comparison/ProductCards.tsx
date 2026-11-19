import type { ReactNode } from "react";
import { affiliateHref } from "@/lib/affiliate";
import { Button } from "@/components/ui/Button";
import { DisclosureLine } from "@/components/site/DisclosureLine";

function Visit({
  href,
  label,
  variant,
  tracking,
}: {
  href: string | null;
  label: string;
  variant: "filled" | "outline";
  tracking: { page: string; brand: string; role: string };
}) {
  if (!href) return <p className="meta">Affiliate link is not connected yet.</p>;
  return (
    <Button href={href} variant={variant} tracking={tracking}>
      {label}
    </Button>
  );
}

function Shell({
  role,
  tone,
  children,
}: {
  role: string;
  tone: "favorite" | "alternative";
  children: ReactNode;
}) {
  return (
    <section className="flex h-full flex-col border border-line bg-card">
      <div className={`border-b border-line px-6 py-3 ${tone === "favorite" ? "bg-favorite-soft" : "bg-paper"}`}>
        <p className={`kicker ${tone === "favorite" ? "text-favorite" : ""}`}>{role}</p>
      </div>
      <div className="grid flex-1 gap-4 p-6">{children}</div>
    </section>
  );
}

type Card = {
  brandName: string;
  brandId: string;
  body: string;
  skip: string;
  linked: boolean;
  pageSlug: string;
  disclosure?: string;
};

export function FavoriteCard(props: Card) {
  return (
    <Shell role="Favorite" tone="favorite">
      <h2>{props.brandName}</h2>
      <p>{props.body || "The reason is still being written."}</p>
      {props.skip ? (
        <p>
          <span className="font-medium">Skip this when </span>
          {props.skip}
        </p>
      ) : null}
      <DisclosureLine text={props.disclosure} />
      <div className="mt-auto">
        <Visit
          href={props.linked ? affiliateHref(props.brandId, props.pageSlug, "favorite") : null}
          label={`Visit ${props.brandName}`}
          variant="filled"
          tracking={{ page: props.pageSlug, brand: props.brandId, role: "favorite" }}
        />
      </div>
    </Shell>
  );
}

export function AlternativeCard(props: Card) {
  return (
    <Shell role="Alternative" tone="alternative">
      <h2>{props.brandName}</h2>
      <p>{props.body || "The reason to choose this instead is still being written."}</p>
      {props.skip ? (
        <p>
          <span className="font-medium">Skip this when </span>
          {props.skip}
        </p>
      ) : null}
      <div className="mt-auto">
        <Visit
          href={props.linked ? affiliateHref(props.brandId, props.pageSlug, "alternative") : null}
          label={`Visit ${props.brandName}`}
          variant="outline"
          tracking={{ page: props.pageSlug, brand: props.brandId, role: "alternative" }}
        />
      </div>
    </Shell>
  );
}
