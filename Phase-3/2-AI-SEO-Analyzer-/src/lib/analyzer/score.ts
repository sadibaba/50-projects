// src\lib\analyzer\score.ts
// src/lib/analyzer/score.ts
import type { CheckResult } from "@/types/analyzer";

/**
 * Scoring methodology
 *
 * - Each check has a relative weight based on its SEO impact.
 * - Weights are NOT required to sum to a fixed total.
 * - Final score is normalized to a 0–100 scale:
 *
 *     score = (earnedPoints / maxPossiblePoints) × 100
 *
 * - This design allows adding or adjusting checks in the future
 *   without breaking the scoring system.
 */

const WEIGHTS: Record<string, number> = {
  // ---- On-page SEO (60) ----
  "title-exists": 15,
  "title-length": 5,
  "meta-desc-exists": 15,
  "meta-desc-length": 5,
  "canonical-exists": 15,

  // ---- Social Preview (20) ----
  "og-title": 5,
  "og-description": 5,
  "og-image": 10,

  "twitter-card": 3,
  "twitter-title": 3,
  "twitter-image": 4,

  // ---- Discovery (20) ----
  "robots-reachable": 10,
  "sitemap-declared": 5,
  "sitemap-fetchable": 5,

  "canonical-host-match": 5,
  "meta-robots-noindex": 15,
};

export function calculateScore(checks: CheckResult[]) {
  let total = 0;
  let max = 0;

  for (const check of checks) {
    const weight = WEIGHTS[check.id];

    // Skip checks that are not scored (weight undefined)
    if (!weight) continue;

    max += weight;

    if (check.status === "pass") {
      total += weight;
    } else if (check.status === "warn") {
      total += weight * 0.6;
    }
    // fail = 0
  }

  // Safety guard (should never happen, but prevents NaN)
  const score = max > 0 ? Math.round((total / max) * 100) : 0;

  return {
    score,
    max,
    total: Math.round(total),
  };
}
