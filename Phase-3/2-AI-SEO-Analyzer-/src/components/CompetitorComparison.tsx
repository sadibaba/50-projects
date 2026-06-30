"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  FileText,
  Link2,
  Image as ImageIcon,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Crown,
  Target,
} from "lucide-react";

interface CompetitorData {
  url: string;
  title: string | null;
  metaDescription: string | null;
  h1Count: number;
  wordCount: number;
  internalLinks: number;
  externalLinks: number;
  images: { total: number; withAlt: number };
}

interface ComparisonData {
  main: CompetitorData;
  competitors: CompetitorData[];
  avgWordCount: number;
  avgTitleLength: number;
  avgMetaDescLength: number;
  suggestions: string[];
  rankings: {
    wordCount: number;
    titleLength: number;
    h1Count: number;
    internalLinks: number;
    imagesWithAlt: number;
  };
}

interface CompetitorComparisonProps {
  data: any;
}

export function CompetitorComparison({ data }: CompetitorComparisonProps) {
  if (!data || !data.main) {
    return null;
  }

  const { main, competitors, suggestions, rankings } = data;

  // Calculate percentages for comparison
  const getComparison = (mainVal: number, compVal: number) => {
    if (compVal === 0) return { percentage: 0, direction: 'equal' };
    const diff = ((mainVal - compVal) / compVal) * 100;
    if (diff > 5) return { percentage: Math.abs(diff), direction: 'up' };
    if (diff < -5) return { percentage: Math.abs(diff), direction: 'down' };
    return { percentage: Math.abs(diff), direction: 'equal' };
  };

  const getStatusIcon = (direction: string) => {
    if (direction === 'up') return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (direction === 'down') return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getStatusColor = (direction: string) => {
    if (direction === 'up') return 'text-green-600';
    if (direction === 'down') return 'text-red-600';
    return 'text-gray-400';
  };

  return (
    <Card className="p-6 sm:p-8 border-0 shadow-xl bg-gradient-to-br from-white to-indigo-50/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-indigo-100">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">Competitor Comparison</h2>
        <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <Crown className="w-3 h-3 mr-1" />
          AI Analysis
        </Badge>
      </div>

      {/* Main vs Competitors */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Metric</th>
              <th className="text-left py-3 px-4 font-semibold text-indigo-600">Your Site</th>
              {competitors.map((comp: CompetitorData, i: number) => (
                <th key={i} className="text-left py-3 px-4 font-semibold text-muted-foreground">
                  <span className="truncate max-w-[100px] block" title={comp.url}>
                    {new URL(comp.url).hostname.replace('www.', '')}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Word Count */}
            <tr className="border-b hover:bg-indigo-50/50 transition-colors">
              <td className="py-3 px-4 font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Word Count
              </td>
              <td className="py-3 px-4 font-bold text-indigo-600">
                {main.wordCount}
              </td>
              {competitors.map((comp: CompetitorData, i: number) => {
                const compare = getComparison(main.wordCount, comp.wordCount);
                return (
                  <td key={i} className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {comp.wordCount}
                      <span className={getStatusColor(compare.direction)}>
                        {getStatusIcon(compare.direction)}
                      </span>
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Title Length */}
            <tr className="border-b hover:bg-indigo-50/50 transition-colors">
              <td className="py-3 px-4 font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                Title Length
              </td>
              <td className="py-3 px-4 font-bold text-indigo-600">
                {main.title?.length || 0}
              </td>
              {competitors.map((comp: CompetitorData, i: number) => {
                const compare = getComparison(main.title?.length || 0, comp.title?.length || 0);
                return (
                  <td key={i} className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {comp.title?.length || 0}
                      <span className={getStatusColor(compare.direction)}>
                        {getStatusIcon(compare.direction)}
                      </span>
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* H1 Count */}
            <tr className="border-b hover:bg-indigo-50/50 transition-colors">
              <td className="py-3 px-4 font-medium flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                H1 Headings
              </td>
              <td className="py-3 px-4 font-bold text-indigo-600">
                {main.h1Count}
              </td>
              {competitors.map((comp: CompetitorData, i: number) => {
                const compare = getComparison(main.h1Count, comp.h1Count);
                return (
                  <td key={i} className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {comp.h1Count}
                      <span className={getStatusColor(compare.direction)}>
                        {getStatusIcon(compare.direction)}
                      </span>
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Internal Links */}
            <tr className="border-b hover:bg-indigo-50/50 transition-colors">
              <td className="py-3 px-4 font-medium flex items-center gap-2">
                <Link2 className="w-4 h-4 text-muted-foreground" />
                Internal Links
              </td>
              <td className="py-3 px-4 font-bold text-indigo-600">
                {main.internalLinks}
              </td>
              {competitors.map((comp: CompetitorData, i: number) => {
                const compare = getComparison(main.internalLinks, comp.internalLinks);
                return (
                  <td key={i} className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {comp.internalLinks}
                      <span className={getStatusColor(compare.direction)}>
                        {getStatusIcon(compare.direction)}
                      </span>
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Images with Alt */}
            <tr className="hover:bg-indigo-50/50 transition-colors">
              <td className="py-3 px-4 font-medium flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                Images with Alt
              </td>
              <td className="py-3 px-4 font-bold text-indigo-600">
                {main.images.withAlt}/{main.images.total}
              </td>
              {competitors.map((comp: CompetitorData, i: number) => {
                const compare = getComparison(main.images.withAlt, comp.images.withAlt);
                return (
                  <td key={i} className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {comp.images.withAlt}/{comp.images.total}
                      <span className={getStatusColor(compare.direction)}>
                        {getStatusIcon(compare.direction)}
                      </span>
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Ranking */}
      <div className="mt-6 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Crown className="w-4 h-4 text-indigo-600" />
          Your Ranking Among Competitors
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Word Count", rank: rankings.wordCount, total: competitors.length + 1 },
            { label: "Title Length", rank: rankings.titleLength, total: competitors.length + 1 },
            { label: "H1 Headings", rank: rankings.h1Count, total: competitors.length + 1 },
            { label: "Internal Links", rank: rankings.internalLinks, total: competitors.length + 1 },
          ].map((item, i) => (
            <div key={i} className="text-center p-2 bg-white rounded-lg shadow-sm">
              <div className="text-xs text-muted-foreground">{item.label}</div>
              <div className="text-lg font-bold text-indigo-600">
                #{item.rank}/{item.total}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            AI-Powered Suggestions
          </h4>
          <ul className="space-y-2">
            {suggestions.map((suggestion: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-indigo-600 mt-1">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}