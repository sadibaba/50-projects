import { fetchHtml, normalizeUrl, assertSafeUrl } from "./fetch";
import { parseHtml } from "./parseHtml";
import { parseContent } from "./parseContent";

export interface CompetitorData {
  url: string;
  title: string | null;
  metaDescription: string | null;
  h1Count: number;
  wordCount: number;
  internalLinks: number;
  externalLinks: number;
  images: { total: number; withAlt: number };
}

export async function analyzeCompetitor(url: string): Promise<CompetitorData> {
  const parsedUrl = normalizeUrl(url);
  assertSafeUrl(parsedUrl);
  
  const { html } = await fetchHtml(parsedUrl);
  const seo = parseHtml(html);
  const content = parseContent(html, url);
  
  // Word count estimate
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = text.split(/\s+/).length;
  
  return {
    url,
    title: seo.title.value,
    metaDescription: seo.metaDescription.value,
    h1Count: content.headings.h1Count,
    wordCount,
    internalLinks: content.links.internal,
    externalLinks: content.links.external,
    images: {
      total: content.images.total,
      withAlt: content.images.withAlt,
    },
  };
}

export function compareWithCompetitors(
  main: CompetitorData,
  competitors: CompetitorData[]
) {
  return {
    // Average comparison
    avgTitleLength: competitors.reduce((sum, c) => sum + (c.title?.length || 0), 0) / competitors.length,
    avgMetaDescLength: competitors.reduce((sum, c) => sum + (c.metaDescription?.length || 0), 0) / competitors.length,
    avgWordCount: competitors.reduce((sum, c) => sum + c.wordCount, 0) / competitors.length,
    
    // Gaps analysis
    missingInMain: {
      titles: competitors.filter(c => c.title && !main.title).map(c => c.url),
      metaDescriptions: competitors.filter(c => c.metaDescription && !main.metaDescription).map(c => c.url),
      h1Count: competitors.filter(c => c.h1Count > main.h1Count).map(c => c.url),
    },
    
    // Recommendations
    suggestions: [
      main.wordCount < (competitors.reduce((sum, c) => sum + c.wordCount, 0) / competitors.length) 
        ? "Increase content length to match competitors"
        : null,
      main.h1Count === 0 
        ? "Add H1 heading like competitors"
        : null,
      main.title === null 
        ? "Add title tag as competitors have"
        : null,
    ].filter(Boolean),
  };
}