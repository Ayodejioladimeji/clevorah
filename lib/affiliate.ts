import type { Brand } from "./types";

export function affiliateHref(
  brandId: string,
  pageSlug: string,
  role: "favorite" | "alternative",
): string {
  const query = new URLSearchParams({ page: pageSlug, role });
  return `/go/${encodeURIComponent(brandId)}?${query.toString()}`;
}

export function outboundUrl(brand: Brand, pageSlug: string, role: string): string {
  const target = new URL(brand.affiliateUrl);
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    throw new Error("Affiliate URL must be http or https.");
  }
  const network = brand.network.trim().toLowerCase();
  const page = pageSlug.slice(0, 120);
  const combined = `${pageSlug}:${role}`.slice(0, 120);
  if (network === "impact") {
    target.searchParams.set("subId1", page);
    target.searchParams.set("subId2", role);
  } else if (network === "awin") {
    target.searchParams.set("clickref", combined);
  } else if (network === "cj") {
    target.searchParams.set("sid", combined);
  } else if (brand.subIdParam) {
    target.searchParams.set(brand.subIdParam, combined);
  }
  return target.toString();
}

export function adminPath(): string {
  const value = process.env.ADMIN_PATH || "/desk--/clevorah--/admin";
  const withSlash = value.startsWith("/") ? value : `/${value}`;
  return withSlash.endsWith("/") ? withSlash.slice(0, -1) : withSlash;
}

export function siteUrl(): string {
  return (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}
