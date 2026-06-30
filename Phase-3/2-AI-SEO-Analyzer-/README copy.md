# SEO Analyzer

A modern, fast, and lightweight **page-level SEO analysis tool** built with **Next.js 16**.
Analyze any public URL, understand how search engines interpret it, and get **actionable, prioritized recommendations**.



---

## Overview

This tool focuses on **how SEO signals are actually evaluated at the page level**, not checklist-based audits.

Instead of relying on external services, it:

- Fetches raw HTML
- Parses SEO-relevant signals
- Validates crawlability and discoverability
- Produces a weighted SEO score with explanations

No database. No tracking. Deterministic analysis only.

---

## Features

### Core Analysis

- **On-Page SEO**

  - Title & meta description validation
  - Canonical URL correctness
  - Meta robots indexability check

- **Content Structure**

  - H1 existence and uniqueness
  - Heading hierarchy validation (H1 → H6)
  - Image `alt` attribute coverage
  - Internal link presence

- **Discovery & Crawlability**

  - `robots.txt` accessibility
  - Sitemap declaration detection
  - Sitemap fetchability & URL count extraction

- **Social Preview**

  - Open Graph metadata
  - Twitter Card metadata

### UX & Output

- Real-time SEO scoring (0–100)
- Actionable recommendations (prioritized by severity)
- Mobile-first responsive UI
- Dark mode support
- Clean, Vercel-inspired interface

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner
- **HTML Parsing**: Cheerio
- **XML Parsing**: fast-xml-parser

---

## Getting Started

### Prerequisites

- Node.js 20+ or Bun
- pnpm (recommended) or npm



## SEO Checks

### On-Page SEO

- Title tag existence
- Title length (10–60 characters)
- Meta description existence
- Meta description length (70–160 characters)
- Canonical URL validation
- Meta robots indexability

### Content Structure

- H1 existence
- Single H1 validation
- Heading hierarchy consistency
- Image `alt` attribute coverage
- Internal link detection

### Discovery

- `robots.txt` reachability
- Sitemap declaration in `robots.txt`
- Sitemap fetchability
- URL count extraction

### Social Metadata

- Open Graph tags
- Twitter Card tags

---

## Scoring System

SEO score is calculated using **weighted checks** based on real-world impact.

| Severity | Weight   |
| -------- | -------- |
| High     | ~15 pts  |
| Medium   | 5–10 pts |
| Low      | 3–5 pts  |

### Interpretation

- **80–100** → Good
- **50–79** → Needs Improvement
- **0–49** → Poor

---

## API Reference

### POST `/api/analyze`

**Request**

```json
{
  "url": "example.com"
}
```

**Response**

```json
{
  "input": { "raw": "...", "normalized": "...", "timestamp": "..." },
  "fetch": { "status": 200, "finalUrl": "...", "size": 12345, "timingMs": 250 },
  "seo": { "title": {}, "metaDescription": {}, "canonical": "..." },
  "discovery": { "robots": {}, "sitemap": {} },
  "checks": [],
  "score": { "score": 85, "max": 100 },
  "recommendations": [],
  "status": "ok"
}
```

---

## Security

- SSRF protection (private IP blocking)
- URL validation & normalization
- Request timeout (9 seconds)
- Response size limit (2MB)
- No persistence, no tracking

---

## Deployment

### Vercel (Recommended)

1. Push repository to GitHub
2. Import project in Vercel
3. Deploy with default settings

### Self-hosted

```bash
pnpm build
pnpm start
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## License

MIT License

---

## Credits

- Next.js
- shadcn/ui
- Lucide Icons

---

