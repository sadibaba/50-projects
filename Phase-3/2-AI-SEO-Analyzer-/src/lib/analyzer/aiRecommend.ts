import type { CheckResult, SeoData, ContentData } from "@/types/analyzer";
import type { Recommendation } from "@/types/recommendation";

// ===== RULES from recommend.ts (Copy here) =====
type Rule = {
  title: string;
  reason: string;
  howToFix: string[];
};

const RULES: Record<string, Rule> = {
  "title-exists": {
    title: "Add a title tag to the page",
    reason: "The title tag is one of the strongest on-page SEO signals and is used as the main headline in search results.",
    howToFix: [
      "Add a <title> tag inside the <head> section.",
      "Keep the title descriptive and relevant to the page content.",
      "Aim for 10–60 characters.",
    ],
  },
  "title-length": {
    title: "Optimize title length",
    reason: "Titles that are too short or too long may be truncated or less effective in search results.",
    howToFix: [
      "Ensure the title length is between 10 and 60 characters.",
      "Place important keywords near the beginning of the title.",
    ],
  },
  "meta-desc-exists": {
    title: "Add a meta description",
    reason: "Meta descriptions help search engines and users understand the page content and can improve click-through rate.",
    howToFix: [
      "Add a meta description tag in the <head> section.",
      "Write a clear and compelling summary of the page.",
    ],
  },
  "meta-desc-length": {
    title: "Optimize meta description length",
    reason: "Meta descriptions that are too short or too long may be truncated in search results.",
    howToFix: [
      "Keep the meta description between 70 and 160 characters.",
      "Focus on summarizing the page content clearly.",
    ],
  },
  "canonical-exists": {
    title: "Add a canonical URL",
    reason: "Canonical URLs help prevent duplicate content issues by specifying the preferred version of a page.",
    howToFix: [
      "Add a <link rel='canonical'> tag in the <head> section.",
      "Use an absolute URL pointing to the preferred page.",
    ],
  },
  "canonical-host-match": {
    title: "Fix canonical URL host mismatch",
    reason: "A canonical URL pointing to a different host may cause search engines to index the wrong domain.",
    howToFix: [
      "Ensure the canonical URL points to the same domain as the page.",
      "Avoid pointing canonical URLs to unrelated domains.",
    ],
  },
  "meta-robots-noindex": {
    title: "Remove noindex directive",
    reason: "Pages marked with noindex cannot appear in search results, which blocks organic visibility.",
    howToFix: [
      "Remove 'noindex' from the meta robots tag.",
      "Ensure the page is intended to be indexable.",
    ],
  },
  "og-title": {
    title: "Add Open Graph title",
    reason: "Open Graph titles control how your page appears when shared on social platforms.",
    howToFix: [
      "Add an og:title meta tag.",
      "Use a clear and descriptive title.",
    ],
  },
  "og-description": {
    title: "Add Open Graph description",
    reason: "Open Graph descriptions improve the appearance and clarity of shared links.",
    howToFix: [
      "Add an og:description meta tag.",
      "Keep it concise and informative.",
    ],
  },
  "og-image": {
    title: "Add Open Graph image",
    reason: "Pages without an Open Graph image may appear less engaging when shared.",
    howToFix: [
      "Add an og:image meta tag.",
      "Use an image with recommended dimensions (1200×630).",
    ],
  },
  "twitter-card": {
    title: "Define Twitter card type",
    reason: "Twitter cards improve how links are displayed when shared on Twitter.",
    howToFix: [
      "Add a twitter:card meta tag.",
      "Use 'summary_large_image' for better visibility.",
    ],
  },
  "twitter-title": {
    title: "Add Twitter title",
    reason: "Twitter titles control how your page appears when shared on Twitter.",
    howToFix: [
      "Add a twitter:title meta tag.",
      "Use a clear and descriptive title.",
    ],
  },
  "twitter-image": {
    title: "Add Twitter image",
    reason: "Twitter images make your shared links more engaging on Twitter.",
    howToFix: [
      "Add a twitter:image meta tag.",
      "Use an image with recommended dimensions (1200×630).",
    ],
  },
  "robots-reachable": {
    title: "Ensure robots.txt is accessible",
    reason: "If robots.txt is unreachable, search engines may have difficulty crawling your site.",
    howToFix: [
      "Ensure robots.txt is available at /robots.txt.",
      "Check server configuration and permissions.",
    ],
  },
  "sitemap-declared": {
    title: "Declare sitemap in robots.txt",
    reason: "Declaring a sitemap helps search engines discover your pages more efficiently.",
    howToFix: [
      "Add a Sitemap directive to robots.txt.",
      "Ensure the sitemap URL is correct and accessible.",
    ],
  },
  "sitemap-fetchable": {
    title: "Fix sitemap accessibility",
    reason: "A sitemap that cannot be fetched prevents search engines from discovering pages efficiently.",
    howToFix: [
      "Ensure the sitemap URL returns a valid XML response.",
      "Fix server errors or incorrect paths.",
    ],
  },
  "h1-exists": {
    title: "Add an H1 heading to your page",
    reason: "The H1 heading is crucial for both users and search engines to understand the main topic of the page.",
    howToFix: [
      "Add an <h1> tag to your page content.",
      "Make it descriptive and relevant to the page content.",
      "Include your primary keyword if appropriate.",
    ],
  },
  "h1-single": {
    title: "Use only one H1 heading",
    reason: "Multiple H1 headings can confuse search engines about the main topic of your page.",
    howToFix: [
      "Keep only one <h1> tag per page.",
      "Use H2-H6 for subheadings and sections.",
      "Ensure the single H1 represents the main page topic.",
    ],
  },
  "heading-hierarchy": {
    title: "Fix heading hierarchy structure",
    reason: "A logical heading hierarchy improves content readability and helps search engines understand your content structure.",
    howToFix: [
      "Don't skip heading levels (e.g., H2 to H4 without H3).",
      "Use headings in sequential order (H1 → H2 → H3).",
      "Avoid empty headings without text content.",
    ],
  },
  "images-alt": {
    title: "Add alt text to all images",
    reason: "Alt text improves accessibility for screen readers and helps search engines understand image content.",
    howToFix: [
      "Add descriptive alt attributes to all <img> tags.",
      "Describe what the image shows, not just 'image' or 'photo'.",
      "Keep alt text concise but meaningful (under 125 characters).",
    ],
  },
  "internal-links": {
    title: "Add internal links to your content",
    reason: "Internal links help search engines discover other pages on your site and improve site navigation.",
    howToFix: [
      "Link to relevant pages within your website.",
      "Use descriptive anchor text that indicates the linked content.",
      "Ensure links are natural and add value to the user.",
    ],
  },
  "schema-exists": {
    title: "Add Schema Markup (JSON-LD)",
    reason: "Schema markup helps search engines understand your content and can improve rich snippet visibility.",
    howToFix: [
      "Add a JSON-LD script tag in the <head> section.",
      "Use Schema.org to find the right schema type for your content.",
      "Test your markup with Google's Rich Results Test.",
    ],
  },
  "schema-faq": {
    title: "Add FAQ Schema",
    reason: "FAQ schema can make your content eligible for rich results with expandable Q&A sections.",
    howToFix: [
      "Identify common questions your audience asks about this topic.",
      "Add a FAQ section to your page with clear questions and answers.",
      "Implement FAQ schema markup using JSON-LD.",
      "Test with Google's Rich Results Test.",
    ],
  },
  "schema-article": {
    title: "Add Article or Product Schema",
    reason: "Article or Product schema helps search engines understand your content type.",
    howToFix: [
      "Determine if your content is an Article or Product.",
      "Add the appropriate schema type.",
      "Include all required properties.",
      "Test with Google's Rich Results Test.",
    ],
  },
};

// ===== Generate Static Recommendations =====
function generateStaticRecommendations(checks: CheckResult[]): Recommendation[] {
  return checks
    .filter((c) => c.status !== "pass")
    .map((check) => {
      const rule = RULES[check.id];
      if (!rule) return null;

      return {
        id: `rec-${check.id}`,
        title: rule.title,
        category: check.category,
        severity: check.severity,
        reason: rule.reason,
        howToFix: rule.howToFix,
        relatedCheckId: check.id,
      };
    })
    .filter(Boolean) as Recommendation[];
}

// ===== Sleep/Delay Function =====
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ===== Fetch AI Suggestions with Retry Logic =====
// Strips ```json ... ``` fences and unwraps stray text some models add around
// the JSON, which is the most common cause of JSON.parse() failing silently.
function extractJsonArray(raw: string): string {
  let text = raw.trim();

  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  if (!text.startsWith("[") && !text.startsWith("{")) {
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) text = arrayMatch[0];
  }

  return text;
}

async function fetchAISuggestionsWithRetry(
  checks: CheckResult[],
  seo: SeoData,
  content: ContentData,
  url: string,
  retries = 3
): Promise<Recommendation[]> {
  const failedChecks = checks.filter(c => c.status !== "pass");

  const prompt = `
    Analyze this webpage's SEO and suggest 3-5 specific improvements:

    URL: ${url}
    Title: ${seo.title.value || "Missing"}
    Meta Description: ${seo.metaDescription.value || "Missing"}
    H1 Count: ${content.headings.h1Count}
    Images without Alt: ${content.images.withoutAlt}

    Issues: ${failedChecks.map(c => `- ${c.label}`).join("\n")}

    Return ONLY a raw JSON object of the form {"recommendations": [...]}, with no
    markdown formatting and no commentary. Each item in the array must look like:
    { "title": string, "category": string, "severity": "low"|"medium"|"high", "reason": string, "howToFix": string[] }
  `;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Skip the wait on the first attempt; only back off on retries.
      if (attempt > 1) {
        await sleep(2000 * attempt);
      }

      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "You are an SEO assistant. You only respond with valid JSON, never markdown or commentary.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 800,
          response_format: { type: "json_object" },
        }),
      });

      // Handle rate limit / quota errors (both return 429)
      if (response.status === 429) {
        const errorText = await response.text();
        let errorType = "unknown";
        try {
          errorType = JSON.parse(errorText)?.error?.type || errorType;
        } catch {
          // ignore parse failure, keep raw text below
        }
        console.log(`⏳ 429 on attempt ${attempt}/${retries} (type: ${errorType}):`, errorText);

        // insufficient_quota means the account is out of credits/billing is not
        // set up — retrying will never help, so fail fast instead of burning
        // all 3 attempts with backoff delays.
        if (errorType === "insufficient_quota") {
          console.error("❌ OpenAI quota exhausted — check billing at platform.openai.com/account/billing. Skipping retries.");
          return [];
        }

        if (attempt === retries) {
          console.warn("⚠️ Rate limit exceeded after all retries");
          return [];
        }
        continue; // Retry — this was a genuine rate limit, backoff and try again
      }

      // Handle other errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ OpenAI API Error (${response.status}):`, errorText);
        if (attempt === retries) return [];
        continue;
      }

      const data = await response.json();
      const rawContent = data?.choices?.[0]?.message?.content;

      if (!rawContent) {
        console.error("❌ OpenAI response had no content:", JSON.stringify(data));
        if (attempt === retries) return [];
        continue;
      }

      // Parse AI response
      try {
        const cleaned = extractJsonArray(rawContent);
        const parsed = JSON.parse(cleaned);

        // response_format json_object always returns an OBJECT, so unwrap the
        // array out of whatever key the model put it under.
        let suggestions: any = Array.isArray(parsed)
          ? parsed
          : Object.values(parsed).find((v) => Array.isArray(v));

        if (!Array.isArray(suggestions)) {
          console.warn("⚠️ AI response did not contain an array. Raw content:", rawContent);
          if (attempt === retries) return [];
          continue;
        }

        return suggestions.map((s: any) => ({
          id: `ai-${Date.now()}-${Math.random()}`,
          title: s.title || "AI Suggestion",
          category: s.category || "onpage",
          severity: s.severity || "medium",
          reason: s.reason || "AI generated recommendation",
          howToFix: Array.isArray(s.howToFix)
            ? s.howToFix
            : [s.howToFix || s.reason || "Implement this suggestion"],
          relatedCheckId: "ai-generated",
        }));
      } catch (parseError) {
        console.error("❌ Failed to parse AI response:", parseError, "Raw content:", rawContent);
        if (attempt === retries) return [];
        continue;
      }

    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error);
      if (attempt === retries) return [];
    }
  }

  return [];
}

// ===== Main Export =====
export async function generateAIRecommendations(
  checks: CheckResult[],
  seo: SeoData,
  content: ContentData,
  url: string
): Promise<Recommendation[]> {
  const staticRecs = generateStaticRecommendations(checks);
  
  if (process.env.DEEPSEEK_API_KEY) {
    try {
      const aiSuggestions = await fetchAISuggestionsWithRetry(checks, seo, content, url);
      if (aiSuggestions.length > 0) {
        console.log(` AI Recommendations added: ${aiSuggestions.length}`);
        return [...staticRecs, ...aiSuggestions];
      } else {
        console.warn(" No AI suggestions generated, using static only");
      }
    } catch (error) {
      console.error(" AI recommendations failed:", error);
    }
  } else {
    console.warn(" No DeepSeek API key found, using static recommendations only");
  }
  
  return staticRecs;
}