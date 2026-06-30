// src\lib\analyzer\fetch.ts
// src/lib/analyzer/fetch.ts
export function normalizeUrl(input: string): URL {
  let value = input.trim();

  if (!value.startsWith("http://") && !value.startsWith("https://")) {
    value = "https://" + value;
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Invalid URL");
  }

  // remove fragment
  url.hash = "";

  return url;
}

function isPrivateIp(host: string): boolean {
  // IPv6 localhost
  if (host === "::1") return true;

  // IPv4
  const parts = host.split(".");
  if (parts.length !== 4) return false;

  const nums = parts.map(Number);
  if (nums.some((n) => Number.isNaN(n))) return false;

  const [a, b] = nums;

  return (
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 192 && b === 168) ||
    (a === 172 && b >= 16 && b <= 31)
  );
}

export function assertSafeUrl(url: URL) {
  const hostname = url.hostname.toLowerCase();

  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    isPrivateIp(hostname)
  ) {
    throw new Error("Blocked URL (private or local address)");
  }
}

export async function fetchHtml(url: URL) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s

  const start = Date.now();

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "SEOAnalyzerBot/1.0 (+https://seo.gabrielnathanael.site/bot-info)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    // Check HTTP status
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Page not found (404)");
      }
      if (res.status === 403) {
        throw new Error("Access forbidden (403)");
      }
      if (res.status === 500) {
        throw new Error("Server error (500)");
      }
      if (res.status >= 400 && res.status < 500) {
        throw new Error(`Client error (${res.status})`);
      }
      if (res.status >= 500) {
        throw new Error(`Server error (${res.status})`);
      }
      throw new Error(`HTTP error (${res.status})`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      throw new Error("Response is not HTML");
    }

    const reader = res.body?.getReader();
    if (!reader) {
      throw new Error("Empty response body");
    }

    const MAX_BYTES = 2 * 1024 * 1024; // 2MB
    let received = 0;
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      received += value.length;
      if (received > MAX_BYTES) {
        throw new Error("HTML response too large");
      }

      chunks.push(value);
    }

    const html = Buffer.concat(chunks).toString("utf-8");

    return {
      html,
      fetch: {
        status: res.status,
        finalUrl: res.url,
        contentType,
        size: received,
        timingMs: Date.now() - start,
      },
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Request timeout - website took too long to respond");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
