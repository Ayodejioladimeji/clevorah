import type { MetadataRoute } from "next";
import { adminPath, siteUrl } from "@/lib/affiliate";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [adminPath(), "/studio", "/go/", "/newsletter/"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
