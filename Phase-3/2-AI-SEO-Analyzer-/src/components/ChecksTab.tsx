// src/components/ChecksTab.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
  ChevronDown,
} from "lucide-react";
import type { CheckResult } from "@/types/analyzer";

interface ChecksTabProps {
  checks: CheckResult[];
}

export function ChecksTab({ checks }: ChecksTabProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [activeTab, setActiveTab] = useState("onpage");

  const categories = {
    onpage: {
      label: "On-Page SEO",
      checks: checks.filter((c) => c.category === "onpage"),
    },
    content: {
      label: "Content",
      checks: checks.filter((c) => c.category === "content"),
    },
    social: {
      label: "Social Media",
      checks: checks.filter((c) => c.category === "social"),
    },
    discovery: {
      label: "Discovery",
      checks: checks.filter((c) => c.category === "discovery"),
    },
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold">Detailed Checks</h2>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <Info className="w-4 h-4" />
          {showInfo ? "Hide info" : "What do these mean?"}
        </button>
      </div>

      {showInfo && (
        <div className="mb-6 p-4 rounded-lg bg-muted/50 border space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm mb-2">
              Understanding the checks
            </h3>
            <button
              onClick={() => setShowInfo(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1.5">Status Icons:</p>
              <div className="space-y-1.5 ml-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span>
                    <strong>Pass:</strong> This check is working correctly
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0" />
                  <span>
                    <strong>Warning:</strong> This check needs attention
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>
                    <strong>Failed:</strong> This check has critical issues
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="font-medium mb-1.5">Severity Levels:</p>
              <div className="space-y-1.5 ml-2">
                <div className="flex items-start gap-2">
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200 text-xs shrink-0"
                  >
                    high
                  </Badge>
                  <span>Critical for SEO - should be fixed immediately</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge
                    variant="outline"
                    className="bg-orange-50 text-orange-700 border-orange-200 text-xs shrink-0"
                  >
                    medium
                  </Badge>
                  <span>Important - recommended to fix soon</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 text-xs shrink-0"
                  >
                    low
                  </Badge>
                  <span>Nice to have - can be improved over time</span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground text-xs pt-2 border-t">
              💡 Tip: Items can pass but still show severity level to indicate
              their importance for SEO.
            </p>
          </div>
        </div>
      )}

      {/* Mobile: Dropdown Select */}
      <div className="block sm:hidden mb-4">
        <div className="relative">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full h-11 px-4 pr-10 rounded-lg border bg-background appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="onpage">
              On-Page SEO ({categories.onpage.checks.length})
            </option>
            <option value="content">
              Content ({categories.content.checks.length})
            </option>
            <option value="social">
              Social Media ({categories.social.checks.length})
            </option>
            <option value="discovery">
              Discovery ({categories.discovery.checks.length})
            </option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
        <div className="mt-4 space-y-3">
          {categories[activeTab as keyof typeof categories].checks.map(
            (check) => (
              <CheckItem key={check.id} check={check} />
            )
          )}
        </div>
      </div>

      {/* Desktop: Tabs */}
      <Tabs defaultValue="onpage" className="w-full hidden sm:block">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="onpage">
            {categories.onpage.label}
            <Badge variant="secondary" className="ml-2">
              {categories.onpage.checks.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="content">
            {categories.content.label}
            <Badge variant="secondary" className="ml-2">
              {categories.content.checks.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="social">
            {categories.social.label}
            <Badge variant="secondary" className="ml-2">
              {categories.social.checks.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="discovery">
            {categories.discovery.label}
            <Badge variant="secondary" className="ml-2">
              {categories.discovery.checks.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {Object.entries(categories).map(([key, { checks }]) => (
          <TabsContent key={key} value={key} className="space-y-3">
            {checks.map((check) => (
              <CheckItem key={check.id} check={check} />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}

function CheckItem({ check }: { check: CheckResult }) {
  const getStatusIcon = (status: string) => {
    if (status === "pass")
      return <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />;
    if (status === "warn")
      return <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />;
    return <XCircle className="w-5 h-5 text-red-600 shrink-0" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === "pass")
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-700 hover:bg-green-100"
        >
          Pass
        </Badge>
      );
    if (status === "warn")
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
        >
          Warning
        </Badge>
      );
    return <Badge variant="destructive">Failed</Badge>;
  };

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

  return (
    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="mt-0.5">{getStatusIcon(check.status)}</div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
          <h3 className="font-medium text-sm sm:text-base">{check.label}</h3>
          <div className="flex items-center gap-2">
            {getSeverityBadge(check.severity)}
          </div>
        </div>
        {check.evidence && (
          <p className="text-xs sm:text-sm text-muted-foreground break-all">
            {check.evidence}
          </p>
        )}
      </div>

      <div className="shrink-0">{getStatusBadge(check.status)}</div>
    </div>
  );
}
