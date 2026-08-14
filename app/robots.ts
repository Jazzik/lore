import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /api/lead принимает только POST и ничего не отдаёт краулеру.
      disallow: "/api/",
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
