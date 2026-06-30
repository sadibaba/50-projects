import { NextResponse } from "next/server";
import { normalizeUrl, assertSafeUrl, fetchHtml } from "@/lib/analyzer/fetch";
import { parseHtml } from "@/lib/analyzer/parseHtml";
import { parseRobots } from "@/lib/analyzer/parseRobots";
import { parseSitemap } from "@/lib/analyzer/parseSitemap";
import { parseContent } from "@/lib/analyzer/parseContent";
import { parseSchema } from "@/lib/analyzer/parseSchema";
import type { SitemapResult } from "@/lib/analyzer/parseSitemap";
import { runChecks } from "@/lib/analyzer/checks";
import { calculateScore } from "@/lib/analyzer/score";
import { generateRecommendations } from "@/lib/analyzer/recommend";
import { generateAIRecommendations } from "@/lib/analyzer/aiRecommend";
import { generateSEOReport } from "@/lib/analyzer/generateReport";
import { generateAIKeywords, generateAIFAQ } from "@/lib/analyzer/aiContent";
import { rateLimit } from "@/lib/ratelimit";
import { headers } from "next/headers";

// Cache for competitor analysis (optional)
const competitorCache = new Map<string, any>();

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    // ===== 1. RATE LIMIT =====
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
    const { success } = await rateLimit.limit(`analyze:${ip}`);

    if (!success) {
      return NextResponse.json(
        { 
          error: "Too many requests. Please wait a moment.",
          retryAfter: 60 
        },
        { 
          status: 429,
          headers: {
            "Retry-After": "60",
          }
        }
      );
    }

    // ===== 2. VALIDATE INPUT =====
    const body = await req.json();
    const rawUrl = body?.url;
    const competitorUrls = body?.competitors || [];
    const useAI = body?.useAI !== false; // Default true

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate competitor URLs
    if (competitorUrls.length > 0) {
      if (!Array.isArray(competitorUrls)) {
        return NextResponse.json(
          { error: "Competitors must be an array of URLs" },
          { status: 400 }
        );
      }
      if (competitorUrls.length > 5) {
        return NextResponse.json(
          { error: "Maximum 5 competitor URLs allowed" },
          { status: 400 }
        );
      }
    }

    // ===== 3. NORMALIZE & VALIDATE URL =====
    let normalized: URL;
    try {
      normalized = normalizeUrl(rawUrl);
      assertSafeUrl(normalized);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Invalid URL" },
        { status: 400 }
      );
    }

    // ===== 4. FETCH & PARSE MAIN PAGE =====
    let html: string;
    let fetchResult: any;
    
    try {
      const result = await fetchHtml(normalized);
      html = result.html;
      fetchResult = result.fetch;
    } catch (err) {
      return NextResponse.json(
        { 
          error: err instanceof Error ? err.message : "Failed to fetch page",
          stage: "fetch"
        },
        { status: 400 }
      );
    }

    // ===== 5. PARSE HTML =====
    let seo, content, schema;
    try {
      seo = parseHtml(html);
      content = parseContent(html, normalized.toString());
      schema = parseSchema(html);
    } catch (err) {
      return NextResponse.json(
        { 
          error: err instanceof Error ? err.message : "Failed to parse HTML",
          stage: "parse"
        },
        { status: 500 }
      );
    }

    // ===== 6. DISCOVERY (Robots + Sitemap) =====
    let robots, sitemap: SitemapResult;
    try {
      robots = await parseRobots(normalized);
      sitemap = { fetched: false, urlCount: null };
      
      if (robots.sitemapUrls.length > 0) {
        sitemap = await parseSitemap(robots.sitemapUrls[0]);
      }
    } catch (err) {
      // Discovery failure shouldn't break the whole analysis
      robots = { reachable: false, sitemapUrls: [] };
      sitemap = { fetched: false, urlCount: null };
    }

    const discovery = { robots, sitemap };

    // ===== 7. RUN CHECKS & CALCULATE SCORE =====
    const checks = runChecks({ seo, discovery, content, schema });
    const { score, total, max } = calculateScore(checks);

    // ===== 8. GENERATE RECOMMENDATIONS =====
    let recommendations = generateRecommendations(checks);

    // AI-enhanced recommendations (if enabled)
    if (useAI && process.env.OPENAI_API_KEY) {
      try {
        const aiRecs = await generateAIRecommendations(checks, seo, content, normalized.toString());
        recommendations = [...recommendations, ...aiRecs];
      } catch (err) {
        console.error("AI recommendations failed:", err);
        // Continue with static recommendations
      }
    }

    // ===== 9. AI KEYWORDS & FAQS =====
    let aiKeywords = null;
    let aiFAQs = null;
    if (useAI && process.env.OPENAI_API_KEY) {
      try {
        const [keywords, faqs] = await Promise.all([
          generateAIKeywords(seo, content),
          generateAIFAQ(seo, content),
        ]);
        aiKeywords = keywords;
        aiFAQs = faqs;
      } catch (err) {
        console.error("AI content generation failed:", err);
      }
    }

    // ===== 10. COMPETITOR ANALYSIS (Optional) =====
    let competitorData = null;
    if (competitorUrls.length > 0) {
      try {
        const { analyzeCompetitor, compareWithCompetitors } = await import("@/lib/analyzer/competitor");
        
        // Analyze all competitors in parallel
        const competitorPromises = competitorUrls.map(async (cUrl: string) => {
          // Check cache first
          const cacheKey = `competitor:${cUrl}`;
          if (competitorCache.has(cacheKey)) {
            return competitorCache.get(cacheKey);
          }
          
          try {
            const result = await analyzeCompetitor(cUrl);
            // Cache for 1 hour
            competitorCache.set(cacheKey, result);
            setTimeout(() => competitorCache.delete(cacheKey), 3600000);
            return result;
          } catch (err) {
            console.error(`Failed to analyze competitor ${cUrl}:`, err);
            return null;
          }
        });

        const competitorResults = await Promise.all(competitorPromises);
        const validCompetitors = competitorResults.filter(Boolean);
        
        if (validCompetitors.length > 0) {
          // Get main page data for comparison
          const mainData = {
            url: normalized.toString(),
            title: seo.title.value,
            metaDescription: seo.metaDescription.value,
            h1Count: content.headings.h1Count,
            wordCount: html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).length,
            internalLinks: content.links.internal,
            externalLinks: content.links.external,
            images: { 
              total: content.images.total, 
              withAlt: content.images.withAlt 
            },
            hasSchema: schema.hasSchema,
            schemaTypes: schema.types,
          };
          
          competitorData = compareWithCompetitors(mainData, validCompetitors);
        }
      } catch (err) {
        console.error("Competitor analysis failed:", err);
        // Don't fail the whole request
      }
    }

    // ===== 11. GENERATE FINAL REPORT =====
    const report = generateSEOReport(
      normalized.toString(),
      score,
      checks,
      seo,
      content,
      discovery,
      recommendations,
      competitorData
    );

    // Add AI content to report
    (report as any).aiKeywords = aiKeywords;
    (report as any).aiFAQs = aiFAQs;
    (report as any).schema = schema;

    // ===== 12. RESPONSE =====
    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        report,
        summary: {
          score,
          totalChecks: checks.length,
          passed: checks.filter(c => c.status === "pass").length,
          warnings: checks.filter(c => c.status === "warn").length,
          failed: checks.filter(c => c.status === "fail").length,
          recommendations: recommendations.length,
          competitorCount: competitorData ? competitorUrls.length : 0,
          responseTime: `${responseTime}ms`,
          hasAIRecommendations: recommendations.some(r => r.id?.startsWith("ai-")),
          hasSchema: schema.hasSchema,
          hasAIKeywords: !!aiKeywords,
          hasAIFAQ: !!aiFAQs,
        },
        raw: {
          url: normalized.toString(),
          fetch: fetchResult,
          htmlPreview: html.slice(0, 2000),
          seo,
          content: {
            headings: {
              h1Count: content.headings.h1Count,
              totalCount: content.headings.totalCount,
              issues: content.headings.issues,
            },
            images: {
              total: content.images.total,
              withAlt: content.images.withAlt,
              withoutAlt: content.images.withoutAlt,
            },
            links: {
              total: content.links.total,
              internal: content.links.internal,
              external: content.links.external,
            },
          },
          schema,
        },
        metadata: {
          analyzedAt: new Date().toISOString(),
          version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
          environment: process.env.NODE_ENV,
        },
      },
    }, {
      headers: {
        "Cache-Control": "private, max-age=60",
      },
    });

  } catch (err: unknown) {
    console.error("Analysis error:", err);
    
    const message = err instanceof Error ? err.message : "Analysis failed";
    const status = err instanceof Error && err.message.includes("timeout") ? 504 : 400;
    
    return NextResponse.json(
      { 
        error: message,
        success: false,
        timestamp: new Date().toISOString(),
      },
      { status }
    );
  }
}

// ===== OPTIONAL: GET endpoint for caching =====
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  
  if (!url) {
    return NextResponse.json(
      { error: "URL parameter required" },
      { status: 400 }
    );
  }

  // Check if we have cached report
  // Implement caching logic here if needed
  
  return NextResponse.json(
    { error: "Caching not implemented. Use POST for analysis." },
    { status: 404 }
  );
}