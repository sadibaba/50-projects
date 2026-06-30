// src/types/analyzer.ts
export interface SeoData {
  title: { value: string | null; length: number };
  metaDescription: { value: string | null; length: number };
  robots: string | null;
  canonical: string | null;
  og: Record<string, string>;
  twitter: Record<string, string>;
}

export interface DiscoveryData {
  robots: {
    reachable: boolean;
    sitemapUrls: string[];
  };
  sitemap: {
    fetched: boolean;
    urlCount: number | null;
  };
}

export interface HeadingNode {
  level: number;
  text: string;
  children: HeadingNode[];
}

export interface ContentData {
  headings: {
    hierarchy: HeadingNode[];
    h1Count: number;
    hasH1: boolean;
    totalCount: number;
    issues: string[];
  };
  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
    missingAltImages: Array<{
      src: string;
      index: number;
    }>;
  };
  links: {
    total: number;
    internal: number;
    external: number;
    internalLinks: string[];
    externalLinks: string[];
  };
}

export type CheckCategory = "onpage" | "social" | "discovery" | "content";
export type CheckStatus = "pass" | "warn" | "fail";
export type CheckSeverity = "high" | "medium" | "low";

export interface CheckResult {
  id: string;
  label: string;
  category: CheckCategory;
  status: CheckStatus;
  severity: CheckSeverity;
  evidence?: string;
}
