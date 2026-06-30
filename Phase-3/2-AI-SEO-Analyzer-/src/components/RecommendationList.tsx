"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, CheckSquare, Sparkles, Brain, FileText, Link2, Image as ImageIcon, Users } from "lucide-react";
import type { Recommendation } from "@/types/recommendation";

interface RecommendationListProps {
  recommendations: Recommendation[];
  aiKeywords?: any;
  aiFAQs?: any;
  schemaData?: any;
}

export function RecommendationList({
  recommendations,
  aiKeywords,
  aiFAQs,
  schemaData,
}: RecommendationListProps) {
  const grouped = {
    high: recommendations.filter((r) => r.severity === "high"),
    medium: recommendations.filter((r) => r.severity === "medium"),
    low: recommendations.filter((r) => r.severity === "low"),
  };

  const hasAI = recommendations.some((r) => r.id?.startsWith("ai-"));

  return (
    <Card className="p-6 sm:p-8 border-0 shadow-xl bg-gradient-to-br from-white to-yellow-50/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
          <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          AI-Powered Recommendations
        </h2>
        <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <Sparkles className="w-3 h-3 mr-1" />
          {recommendations.length} total
        </Badge>
        {hasAI && (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <Brain className="w-3 h-3 mr-1" />
            AI Enhanced
          </Badge>
        )}
      </div>

      {/* AI Keywords Section */}
      {aiKeywords && aiKeywords.keywords && aiKeywords.keywords.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-indigo-600" />
            Suggested Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {aiKeywords.keywords.map((keyword: string, i: number) => (
              <Badge key={i} className="bg-white border-indigo-200 text-indigo-700">
                {keyword}
              </Badge>
            ))}
          </div>
          {aiKeywords.missingKeywords && aiKeywords.missingKeywords.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-red-600 font-medium">Missing Keywords:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {aiKeywords.missingKeywords.map((keyword: string, i: number) => (
                  <Badge key={i} variant="destructive" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI FAQs Section */}
      {aiFAQs && aiFAQs.questions && aiFAQs.questions.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-green-600" />
            Suggested FAQs
          </h3>
          <div className="space-y-3">
            {aiFAQs.questions.map((faq: any, i: number) => (
              <div key={i} className="bg-white rounded-lg p-3 border border-green-100">
                <p className="font-medium text-sm text-green-800">Q: {faq.question}</p>
                <p className="text-sm text-gray-600 mt-1">A: {faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schema Section */}
      {schemaData && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
            <Link2 className="w-4 h-4 text-blue-600" />
            Schema Status
          </h3>
          {schemaData.hasSchema ? (
            <div>
              <Badge className="bg-green-100 text-green-700">✅ Schema Found</Badge>
              <p className="text-sm mt-2 text-gray-600">
                Types: {schemaData.types.join(", ")}
              </p>
            </div>
          ) : (
            <div>
              <Badge variant="destructive">❌ No Schema Found</Badge>
              <p className="text-sm mt-2 text-gray-600">
                Add JSON-LD schema to improve search visibility
              </p>
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      <div className="space-y-6">
        {grouped.high.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              High Priority ({grouped.high.length})
            </h3>
            <div className="space-y-3">
              {grouped.high.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>
        )}

        {grouped.medium.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-orange-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
              Medium Priority ({grouped.medium.length})
            </h3>
            <div className="space-y-3">
              {grouped.medium.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>
        )}

        {grouped.low.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              Low Priority ({grouped.low.length})
            </h3>
            <div className="space-y-3">
              {grouped.low.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const isAI = recommendation.id?.startsWith("ai-");

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, string> = {
      high: "bg-red-50 text-red-700 border-red-200",
      medium: "bg-orange-50 text-orange-700 border-orange-200",
      low: "bg-blue-50 text-blue-700 border-blue-200",
    };
    return (
      <Badge variant="outline" className={variants[severity]}>
        {severity}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const labels: Record<string, string> = {
      onpage: "On-Page",
      content: "Content",
      social: "Social",
      discovery: "Discovery",
    };
    return (
      <Badge variant="secondary" className="text-xs">
        {labels[category] || category}
      </Badge>
    );
  };

  return (
    <div className={`p-4 rounded-xl border ${isAI ? 'border-purple-200 bg-purple-50/30' : 'bg-card hover:shadow-md transition-shadow'}`}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-semibold text-sm sm:text-base">
            {recommendation.title}
          </h4>
          {isAI && (
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[10px]">
              <Brain className="w-3 h-3 mr-1" />
              AI
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {getCategoryBadge(recommendation.category)}
          {getSeverityBadge(recommendation.severity)}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {recommendation.reason}
      </p>

      <div className="space-y-2">
        <h5 className="text-sm font-medium flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-indigo-600" />
          How to fix:
        </h5>
        <ul className="space-y-1.5 ml-6">
          {recommendation.howToFix.map((step, idx) => (
            <li key={idx} className="text-sm text-muted-foreground list-disc">
              {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}