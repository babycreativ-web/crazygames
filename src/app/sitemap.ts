import { MetadataRoute } from "next";
import gamesData from "@/data/games.json";
import { Game } from "@/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use Vercel's URL from env variables if available, otherwise default to a preview URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.crazyarcade.online";

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
  ];

  const categorySlugs = [
    "action",
    "adventure",
    "arcade",
    "board",
    "card",
    "clicker",
    "driving",
    "io",
    "puzzle",
    "shooting",
    "simulation",
    "sports",
    "strategy",
    "thinky",
    "trivia",
    "word",
    "unblocked",
  ];

  const categoryUrls = categorySlugs.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const gameUrls = (gamesData as Game[]).map((game) => ({
    url: `${baseUrl}/game/${game.slug || game.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticUrls, ...categoryUrls, ...gameUrls];
}
