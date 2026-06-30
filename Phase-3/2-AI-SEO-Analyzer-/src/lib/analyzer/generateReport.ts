import type { CheckResult, SeoData, ContentData, DiscoveryData } from "@/types/analyzer";
import type { Recommendation } from "@/types/recommendation";

export interface SEOReport {
  url: string;
  score: number;
  checks: CheckResult[];
  seo: SeoData;
  content: ContentData;
  discovery: DiscoveryData;
  recommendations: Recommendation[];
  competitorComparison?: any;
  generatedAt: Date;
}

export function generateSEOReport(
  url: string,
  score: number,
  checks: CheckResult[],
  seo: SeoData,
  content: ContentData,
  discovery: DiscoveryData,
  recommendations: Recommendation[],
  competitorData?: any
): SEOReport {
  return {
    url,
    score,
    checks,
    seo,
    content,
    discovery,
    recommendations,
    competitorComparison: competitorData,
    generatedAt: new Date(),
  };
}

// Report ko JSON/PDF mein convert karne ke liye helpers
export function toJSON(report: SEOReport): string {
  return JSON.stringify(report, null, 2);
}

export function toMarkdown(report: SEOReport): string {
  const lines = [
    `# SEO Analysis Report`,
    `**URL:** ${report.url}`,
    `**Score:** ${report.score}/100`,
    `**Generated:** ${report.generatedAt.toLocaleString()}`,
    ``,
    `## Summary`,
    `- Total Checks: ${report.checks.length}`,
    `- Passed: ${report.checks.filter(c => c.status === "pass").length}`,
    `- Warnings: ${report.checks.filter(c => c.status === "warn").length}`,
    `- Failed: ${report.checks.filter(c => c.status === "fail").length}`,
    ``,
    `## SEO Details`,
    `- Title: ${report.seo.title.value || "Missing"}`,
    `- Meta Description: ${report.seo.metaDescription.value || "Missing"}`,
    `- H1 Count: ${report.content.headings.h1Count}`,
    `- Images: ${report.content.images.withAlt}/${report.content.images.total} with alt text`,
    ``,
    `## Recommendations`,
    ...report.recommendations.map(r => 
      `### ${r.title}\n- Severity: ${r.severity}\n- Reason: ${r.reason}`
    ),
    ``,
    `## Detailed Checks`,
    ...report.checks.map(c => 
      `- ${c.label}: ${c.status === "pass" ? "✅" : c.status === "warn" ? "⚠️" : "❌"} ${c.evidence || ""}`
    ),
  ];
  
  return lines.join("\n");
}