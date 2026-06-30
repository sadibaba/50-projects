// src\lib\analyzer\parseSitemap.ts
import { XMLParser } from "fast-xml-parser";

export interface SitemapResult {
  fetched: boolean;
  urlCount: number | null;
}

export async function parseSitemap(sitemapUrl: string): Promise<SitemapResult> {
  try {
    const res = await fetch(sitemapUrl, {
      headers: {
        "User-Agent": "SEOAnalyzerBot/1.0 (+https://seo.gabrielnathanael.site)",
        Accept: "application/xml,text/xml",
      },
    });

    if (!res.ok) {
      return { fetched: false, urlCount: null };
    }

    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const data = parser.parse(xml);

    // sitemap index OR urlset
    if (data?.urlset?.url) {
      const urls = Array.isArray(data.urlset.url)
        ? data.urlset.url
        : [data.urlset.url];
      return { fetched: true, urlCount: urls.length };
    }

    if (data?.sitemapindex?.sitemap) {
      const sitemaps = Array.isArray(data.sitemapindex.sitemap)
        ? data.sitemapindex.sitemap
        : [data.sitemapindex.sitemap];
      return { fetched: true, urlCount: sitemaps.length };
    }

    return { fetched: true, urlCount: 0 };
  } catch {
    return { fetched: false, urlCount: null };
  }
}
