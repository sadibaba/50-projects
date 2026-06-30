// src/lib/analyzer/parseContent.ts
import * as cheerio from "cheerio";

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

interface FlatHeading {
  level: number;
  text: string;
}

export function parseContent(html: string, pageUrl: string): ContentData {
  const $ = cheerio.load(html);

  // ---- Parse Headings ----
  const flatHeadings: FlatHeading[] = [];
  let h1Count = 0;

  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const tagName = $(el).prop("tagName")?.toLowerCase();
    if (!tagName) return;

    const level = parseInt(tagName.replace("h", ""));
    let text = $(el).text().trim();

    // Limit heading text to 80 chars
    if (text.length > 80) {
      text = text.substring(0, 80) + "...";
    }

    if (level === 1) h1Count++;

    flatHeadings.push({ level, text: text || "(empty heading)" });
  });

  // Build hierarchy tree
  const hierarchy = buildHeadingTree(flatHeadings);

  // Detect issues
  const issues: string[] = [];

  if (h1Count === 0) {
    issues.push("No H1 heading found");
  } else if (h1Count > 1) {
    issues.push(`Multiple H1 headings found (${h1Count})`);
  }

  // Check for empty headings
  const emptyCount = flatHeadings.filter(
    (h) => h.text === "(empty heading)"
  ).length;
  if (emptyCount > 0) {
    issues.push(
      `${emptyCount} empty heading${emptyCount > 1 ? "s" : ""} found`
    );
  }

  // Check for skipped levels in tree
  const skipIssues = detectSkippedLevels(hierarchy);
  issues.push(...skipIssues);

  // ---- Parse Images ----
  const images: Array<{ src: string; hasAlt: boolean }> = [];

  $("img").each((_, el) => {
    const src = $(el).attr("src") || "";
    const alt = $(el).attr("alt");
    const hasAlt = alt !== undefined && alt.trim() !== "";

    images.push({ src, hasAlt });
  });

  const missingAltImages = images
    .map((img, index) => ({ ...img, index: index + 1 }))
    .filter((img) => !img.hasAlt)
    .map((img) => ({
      src: formatImageSrc(img.src),
      index: img.index,
    }));

  // ---- Parse Links ----
  const pageDomain = getHostname(pageUrl);
  const internalLinks: string[] = [];
  const externalLinks: string[] = [];

  // Pre-create URL object once for base URL
  let baseUrl: URL | null = null;
  try {
    baseUrl = new URL(pageUrl);
  } catch {
    // If pageUrl is invalid, skip link processing
  }

  if (baseUrl) {
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") || "";

      // Skip anchors and javascript
      if (href.startsWith("#") || href.startsWith("javascript:")) return;

      // Check if internal or external
      if (
        href.startsWith("/") ||
        href.startsWith("./") ||
        href.startsWith("../")
      ) {
        // Convert relative to absolute (fast path)
        try {
          const absoluteUrl = new URL(href, baseUrl).toString();
          internalLinks.push(absoluteUrl);
        } catch {
          internalLinks.push(href);
        }
      } else if (href.startsWith("http://") || href.startsWith("https://")) {
        const linkDomain = getHostname(href);
        if (linkDomain === pageDomain) {
          internalLinks.push(href);
        } else {
          externalLinks.push(href);
        }
      } else {
        // Relative link without slash (rare but possible)
        try {
          const absoluteUrl = new URL(href, baseUrl).toString();
          internalLinks.push(absoluteUrl);
        } catch {
          internalLinks.push(href);
        }
      }
    });
  }

  return {
    headings: {
      hierarchy,
      h1Count,
      hasH1: h1Count > 0,
      totalCount: flatHeadings.length,
      issues,
    },
    images: {
      total: images.length,
      withAlt: images.filter((img) => img.hasAlt).length,
      withoutAlt: missingAltImages.length,
      missingAltImages,
    },
    links: {
      total: internalLinks.length + externalLinks.length,
      internal: internalLinks.length,
      external: externalLinks.length,
      internalLinks,
      externalLinks,
    },
  };
}

// Build tree structure from flat headings
function buildHeadingTree(flatHeadings: FlatHeading[]): HeadingNode[] {
  const root: HeadingNode[] = [];
  const stack: HeadingNode[] = [];

  for (const heading of flatHeadings) {
    const node: HeadingNode = {
      level: heading.level,
      text: heading.text,
      children: [],
    };

    // Find parent
    while (stack.length > 0 && stack[stack.length - 1].level >= node.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  }

  return root;
}

// Detect skipped levels in hierarchy
function detectSkippedLevels(nodes: HeadingNode[], parentLevel = 0): string[] {
  const issues: string[] = [];

  for (const node of nodes) {
    // Check if there's a skip
    const expectedMax = parentLevel + 1;
    if (node.level > expectedMax) {
      const skipped = Array.from(
        { length: node.level - expectedMax },
        (_, i) => `H${expectedMax + i}`
      ).join(", ");
      issues.push(
        `H${node.level} found without ${skipped} (in "${node.text}")`
      );
    }

    // Recursively check children
    issues.push(...detectSkippedLevels(node.children, node.level));
  }

  return issues;
}

// Format image src for display
function formatImageSrc(src: string): string {
  // Data URI
  if (src.startsWith("data:")) {
    return "Inline image (data URI)";
  }

  // Try to extract filename
  try {
    const url = new URL(src, "https://placeholder.com");
    const pathname = url.pathname;
    const parts = pathname.split("/");
    const filename = parts[parts.length - 1];

    // If filename has extension, return it
    if (filename && /\.[a-z]{2,4}$/i.test(filename)) {
      return filename;
    }

    // Otherwise return last 40 chars of full path
    if (src.length > 40) {
      return "..." + src.slice(-37);
    }
    return src;
  } catch {
    // If not a valid URL, return limited string
    if (src.length > 40) {
      return src.slice(0, 37) + "...";
    }
    return src;
  }
}

// Extract hostname from URL
function getHostname(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.hostname.toLowerCase();
  } catch {
    return null;
  }
}
