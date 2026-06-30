import * as cheerio from "cheerio";

export interface ParsedSeo {
  title: {
    value: string | null;
    length: number;
  };
  metaDescription: {
    value: string | null;
    length: number;
  };
  robots: string | null;
  canonical: string | null;
  og: Record<string, string>;
  twitter: Record<string, string>;
}

export function parseHtml(html: string): ParsedSeo {
  const $ = cheerio.load(html);

  // ---- Title ----
  const titleText = $("title").first().text().trim() || null;

  // ---- Meta description ----
  const metaDesc =
    $('meta[name="description"]').attr("content")?.trim() || null;

  // ---- Meta robots ----
  const robots = $('meta[name="robots"]').attr("content")?.trim() || null;

  // ---- Canonical ----
  const canonical = $('link[rel="canonical"]').attr("href")?.trim() || null;

  // ---- OpenGraph ----
  const og: Record<string, string> = {};
  $('meta[property^="og:"]').each((_, el) => {
    const prop = $(el).attr("property");
    const content = $(el).attr("content");
    if (prop && content) {
      og[prop] = content.trim();
    }
  });

  // ---- Twitter ----
  const twitter: Record<string, string> = {};
  $('meta[name^="twitter:"]').each((_, el) => {
    const name = $(el).attr("name");
    const content = $(el).attr("content");
    if (name && content) {
      twitter[name] = content.trim();
    }
  });

  return {
    title: {
      value: titleText,
      length: titleText ? titleText.length : 0,
    },
    metaDescription: {
      value: metaDesc,
      length: metaDesc ? metaDesc.length : 0,
    },
    robots,
    canonical,
    og,
    twitter,
  };
}
