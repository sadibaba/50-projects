// src\types\recommendation.ts
export interface Recommendation {
  id: string;
  title: string;
  category: "onpage" | "social" | "discovery";
  severity: "high" | "medium" | "low";
  reason: string;
  howToFix: string[];
  relatedCheckId: string;
}
