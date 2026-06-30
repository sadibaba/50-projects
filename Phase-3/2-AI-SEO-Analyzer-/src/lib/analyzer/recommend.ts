import type { CheckResult } from "@/types/analyzer";
import type { Recommendation } from "@/types/recommendation";

type Rule = {
  title: string;
  reason: string;
  howToFix: string[];
};

const RULES: Record<string, Rule> = {
  "title-exists": {
    title: "Add a title tag to the page",
    reason:
      "The title tag is one of the strongest on-page SEO signals and is used as the main headline in search results.",
    howToFix: [
      "Add a <title> tag inside the <head> section.",
      "Keep the title descriptive and relevant to the page content.",
      "Aim for 10–60 characters.",
    ],
  },

  "title-length": {
    title: "Optimize title length",
    reason:
      "Titles that are too short or too long may be truncated or less effective in search results.",
    howToFix: [
      "Ensure the title length is between 10 and 60 characters.",
      "Place important keywords near the beginning of the title.",
    ],
  },

  "meta-desc-exists": {
    title: "Add a meta description",
    reason:
      "Meta descriptions help search engines and users understand the page content and can improve click-through rate.",
    howToFix: [
      "Add a meta description tag in the <head> section.",
      "Write a clear and compelling summary of the page.",
    ],
  },

  "meta-desc-length": {
    title: "Optimize meta description length",
    reason:
      "Meta descriptions that are too short or too long may be truncated in search results.",
    howToFix: [
      "Keep the meta description between 70 and 160 characters.",
      "Focus on summarizing the page content clearly.",
    ],
  },

  "canonical-exists": {
    title: "Add a canonical URL",
    reason:
      "Canonical URLs help prevent duplicate content issues by specifying the preferred version of a page.",
    howToFix: [
      "Add a <link rel='canonical'> tag in the <head> section.",
      "Use an absolute URL pointing to the preferred page.",
    ],
  },

  "canonical-host-match": {
    title: "Fix canonical URL host mismatch",
    reason:
      "A canonical URL pointing to a different host may cause search engines to index the wrong domain.",
    howToFix: [
      "Ensure the canonical URL points to the same domain as the page.",
      "Avoid pointing canonical URLs to unrelated domains.",
    ],
  },

  "meta-robots-noindex": {
    title: "Remove noindex directive",
    reason:
      "Pages marked with noindex cannot appear in search results, which blocks organic visibility.",
    howToFix: [
      "Remove 'noindex' from the meta robots tag.",
      "Ensure the page is intended to be indexable.",
    ],
  },

  "og-title": {
    title: "Add Open Graph title",
    reason:
      "Open Graph titles control how your page appears when shared on social platforms.",
    howToFix: [
      "Add an og:title meta tag.",
      "Use a clear and descriptive title.",
    ],
  },

  "og-description": {
    title: "Add Open Graph description",
    reason:
      "Open Graph descriptions improve the appearance and clarity of shared links.",
    howToFix: [
      "Add an og:description meta tag.",
      "Keep it concise and informative.",
    ],
  },

  "og-image": {
    title: "Add Open Graph image",
    reason:
      "Pages without an Open Graph image may appear less engaging when shared.",
    howToFix: [
      "Add an og:image meta tag.",
      "Use an image with recommended dimensions (1200×630).",
    ],
  },

  "twitter-card": {
    title: "Define Twitter card type",
    reason:
      "Twitter cards improve how links are displayed when shared on Twitter.",
    howToFix: [
      "Add a twitter:card meta tag.",
      "Use 'summary_large_image' for better visibility.",
    ],
  },

  "twitter-title": {
    title: "Add Twitter title",
    reason:
      "Twitter titles control how your page appears when shared on Twitter.",
    howToFix: [
      "Add a twitter:title meta tag.",
      "Use a clear and descriptive title.",
    ],
  },

  "twitter-image": {
    title: "Add Twitter image",
    reason:
      "Twitter images make your shared links more engaging on Twitter.",
    howToFix: [
      "Add a twitter:image meta tag.",
      "Use an image with recommended dimensions (1200×630).",
    ],
  },

  "robots-reachable": {
    title: "Ensure robots.txt is accessible",
    reason:
      "If robots.txt is unreachable, search engines may have difficulty crawling your site.",
    howToFix: [
      "Ensure robots.txt is available at /robots.txt.",
      "Check server configuration and permissions.",
    ],
  },

  "sitemap-declared": {
    title: "Declare sitemap in robots.txt",
    reason:
      "Declaring a sitemap helps search engines discover your pages more efficiently.",
    howToFix: [
      "Add a Sitemap directive to robots.txt.",
      "Ensure the sitemap URL is correct and accessible.",
    ],
  },

  "sitemap-fetchable": {
    title: "Fix sitemap accessibility",
    reason:
      "A sitemap that cannot be fetched prevents search engines from discovering pages efficiently.",
    howToFix: [
      "Ensure the sitemap URL returns a valid XML response.",
      "Fix server errors or incorrect paths.",
    ],
  },

  // ---- Content Structure ----

  "h1-exists": {
    title: "Add an H1 heading to your page",
    reason:
      "The H1 heading is crucial for both users and search engines to understand the main topic of the page.",
    howToFix: [
      "Add an <h1> tag to your page content.",
      "Make it descriptive and relevant to the page content.",
      "Include your primary keyword if appropriate.",
    ],
  },

  "h1-single": {
    title: "Use only one H1 heading",
    reason:
      "Multiple H1 headings can confuse search engines about the main topic of your page.",
    howToFix: [
      "Keep only one <h1> tag per page.",
      "Use H2-H6 for subheadings and sections.",
      "Ensure the single H1 represents the main page topic.",
    ],
  },

  "heading-hierarchy": {
    title: "Fix heading hierarchy structure",
    reason:
      "A logical heading hierarchy improves content readability and helps search engines understand your content structure.",
    howToFix: [
      "Don't skip heading levels (e.g., H2 to H4 without H3).",
      "Use headings in sequential order (H1 → H2 → H3).",
      "Avoid empty headings without text content.",
    ],
  },

  "images-alt": {
    title: "Add alt text to all images",
    reason:
      "Alt text improves accessibility for screen readers and helps search engines understand image content.",
    howToFix: [
      "Add descriptive alt attributes to all <img> tags.",
      "Describe what the image shows, not just 'image' or 'photo'.",
      "Keep alt text concise but meaningful (under 125 characters).",
    ],
  },

  "internal-links": {
    title: "Add internal links to your content",
    reason:
      "Internal links help search engines discover other pages on your site and improve site navigation.",
    howToFix: [
      "Link to relevant pages within your website.",
      "Use descriptive anchor text that indicates the linked content.",
      "Ensure links are natural and add value to the user.",
    ],
  },

  // ---- Schema Rules (NEW) ----

  "schema-exists": {
    title: "Add Schema Markup (JSON-LD)",
    reason:
      "Schema markup helps search engines understand your content and can improve rich snippet visibility in search results.",
    howToFix: [
      "Add a JSON-LD script tag in the <head> section.",
      "Use Schema.org to find the right schema type for your content.",
      "Implement Article schema for blog posts.",
      "Implement Product schema for e-commerce pages.",
      "Implement FAQ schema for Q&A content.",
      "Test your markup with Google's Rich Results Test.",
    ],
  },

  "schema-faq": {
    title: "Add FAQ Schema",
    reason:
      "FAQ schema can make your content eligible for rich results with expandable Q&A sections in search results.",
    howToFix: [
      "Identify common questions your audience asks about this topic.",
      "Add a FAQ section to your page with clear questions and answers.",
      "Implement FAQ schema markup using JSON-LD.",
      "Test with Google's Rich Results Test.",
    ],
  },

  "schema-article": {
    title: "Add Article or Product Schema",
    reason:
      "Article or Product schema helps search engines understand your content type and display it properly.",
    howToFix: [
      "Determine if your content is an Article or Product.",
      "Add the appropriate schema type.",
      "Include all required properties (headline, image, author, etc.).",
      "Test with Google's Rich Results Test.",
    ],
  },
};

export function generateRecommendations(
  checks: CheckResult[]
): Recommendation[] {
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