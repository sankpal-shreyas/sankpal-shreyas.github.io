import type { MetadataRoute } from "next";
import { site } from "@/lib/config";
import { getAllPostSlugs } from "@/lib/mdx";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = site.baseUrl.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/projects",
    "/blog",
    "/contact",
  ].map((r) => ({
    url: `${base}${r}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = getAllPostSlugs().map((slug) => ({
    url: `${base}/blog/${slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
