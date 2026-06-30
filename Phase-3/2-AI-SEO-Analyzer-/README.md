# AI-SEO Analyzer

An AI-powered SEO audit tool that analyzes any URL, compares it against competitors, and generates actionable recommendations to improve search rankings.

## Overview

An AI-powered SEO audit tool — extended with competitor analysis, AI-generated recommendations, and a redesigned UI.

## Features

**1. URL Analysis**
Parses and checks SEO title, meta description, URL structure, heading hierarchy (H1–H6), images & alt text, internal/external links, canonical tag, robots meta, word count, and core technical SEO (robots.txt, sitemap) — 18+ automated checks in total.

**2. Competitor Analysis**
Add up to 5 competitor URLs for a side-by-side comparison: missing keywords, headings, FAQs, images, internal links, and schema markup.

**3. SEO Report**
A clean dashboard showing overall SEO score, technical & content sub-scores, page strengths/weaknesses, and a full breakdown of every check.

**4. AI Recommendations**
Instead of just flagging issues, the AI suggests concrete fixes — better titles, meta descriptions, headings, keywords, FAQs, alt text, and schema — leaving the final decision to the user.

## What I Built / Changed

- Added the AI recommendation engine (`aiRecommend.ts`) — calls an LLM API to generate page-specific, context-aware suggestions instead of static advice.
- Built the competitor analysis module (`competitor.ts`, `CompetitorComparison.tsx`) from scratch — not present in the base project.
- Restructured the SEO report data layer for clearer, more useful output.
- Redesigned the UI — modern layout, gradients, responsive design.
- Added rate limiting (Upstash Redis) to protect the API from abuse.
- Set up secure environment variable handling for all API keys.

## Tech Stack

Next.js (React) · TypeScript · Tailwind CSS · shadcn/ui · Cheerio · Upstash Redis · OpenAI API

## Project Structure

```
src/
├── app/
│   ├── api/analyze/        # Main API route
│   └── page.tsx            # Main UI
├── components/
│   ├── CompetitorComparison.tsx
│   ├── RecommendationList.tsx
│   └── ScoreCard.tsx
├── lib/analyzer/
│   ├── aiRecommend.ts      # AI recommendation engine
│   ├── competitor.ts       # Competitor comparison logic
│   ├── checks.ts           # Core SEO checks
│   ├── fetch.ts            # HTML fetching
│   ├── parseHtml.ts        # Meta data parsing
│   ├── parseContent.ts     # Content structure parsing
│   └── score.ts            # Scoring system
└── types/
```

## Getting Started

```bash
git clone https://github.com/sadibaba/50-projects.git
cd ai-seo-analyzer
npm install
```

Create a `.env.local` file:

```env
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
OPENAI_API_KEY=your_openai_api_key
```

Run it:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Note: AI recommendations require a valid `OPENAI_API_KEY`. Without one, the app still works with static rule-based suggestions.

## Acknowledgments

Built on top of the open-source SEO analyzer originally created by [Gabriel Nathanael Purba](https://github.com/GabrielNathanael), extended with competitor analysis, AI recommendations, and UI improvements for this project.

## Author

Sheikh Muhammad Aizaz — [GitHub](https://github.com/sadibaba) · [Portfolio](https://nova-desk-flax.vercel.app/)