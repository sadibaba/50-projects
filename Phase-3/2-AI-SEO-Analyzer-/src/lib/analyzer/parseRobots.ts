// src\lib\analyzer\parseRobots.ts
export interface RobotsResult {
  reachable: boolean;
  sitemapUrls: string[];
}

export async function parseRobots(origin: URL): Promise<RobotsResult> {
  const robotsUrl = new URL("/robots.txt", origin);

  try {
    const res = await fetch(robotsUrl.toString(), {
      headers: {
        "User-Agent": "SEOAnalyzerBot/1.0 (+https://seo.gabrielnathanael.site)",
        Accept: "text/plain",
      },
    });

    if (!res.ok) {
      return { reachable: false, sitemapUrls: [] };
    }

    const text = await res.text();
    const sitemapUrls: string[] = [];

    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (/^sitemap:/i.test(trimmed)) {
        const url = trimmed.split(":").slice(1).join(":").trim();
        if (url) sitemapUrls.push(url);
      }
    }

    return {
      reachable: true,
      sitemapUrls,
    };
  } catch {
    return { reachable: false, sitemapUrls: [] };
  }
}
