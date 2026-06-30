import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Link as LinkIcon,
} from "lucide-react";
import type { ContentData, HeadingNode } from "@/types/analyzer";
import { useState } from "react";

interface ContentStructureTabProps {
  content: ContentData;
}

export function ContentStructureTab({ content }: ContentStructureTabProps) {
  const [showInternalLinks, setShowInternalLinks] = useState(false);
  const [showExternalLinks, setShowExternalLinks] = useState(false);

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
        <h2 className="text-xl sm:text-2xl font-semibold">Content Structure</h2>
      </div>

      <div className="space-y-6">
        {/* Heading Hierarchy */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold">
              Heading Hierarchy
            </h3>
            <Badge variant="secondary">
              {content.headings.totalCount} heading
              {content.headings.totalCount !== 1 ? "s" : ""}
            </Badge>
          </div>

          {content.headings.issues.length > 0 && (
            <div className="mb-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    Issues detected:
                  </p>
                  <ul className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                    {content.headings.issues.map((issue, idx) => (
                      <li key={idx}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {content.headings.hierarchy.length > 0 ? (
            <div className="space-y-1">
              {content.headings.hierarchy.map((node, idx) => (
                <HeadingTree key={idx} node={node} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No headings found</p>
          )}
        </div>

        {/* Images */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold">Images</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{content.images.total} total</Badge>
              {content.images.withoutAlt > 0 && (
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200"
                >
                  {content.images.withoutAlt} missing alt
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="p-3 rounded-lg border bg-card">
              <div className="text-2xl font-bold text-foreground">
                {content.images.total}
              </div>
              <div className="text-xs text-muted-foreground">Total Images</div>
            </div>
            <div className="p-3 rounded-lg border bg-card">
              <div className="text-2xl font-bold text-primary">
                {content.images.withAlt}
              </div>
              <div className="text-xs text-muted-foreground">With Alt Text</div>
            </div>
            <div className="p-3 rounded-lg border bg-card">
              <div className="text-2xl font-bold text-primary">
                {content.images.withoutAlt}
              </div>
              <div className="text-xs text-muted-foreground">
                Without Alt Text
              </div>
            </div>
          </div>

          {content.images.missingAltImages.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Images missing alt text:
              </h4>
              <div className="max-h-64 overflow-y-auto rounded-lg border bg-card">
                <div className="divide-y">
                  {content.images.missingAltImages.map((img) => (
                    <div
                      key={img.index}
                      className="flex items-start gap-2 p-2 sm:p-3 bg-yellow-50 dark:bg-yellow-900/10 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors"
                    >
                      <Badge
                        variant="outline"
                        className="shrink-0 text-xs bg-yellow-100 dark:bg-yellow-900/30"
                      >
                        #{img.index}
                      </Badge>
                      <code className="flex-1 break-all text-xs text-muted-foreground">
                        {img.src}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {content.images.total === 0 && (
            <p className="text-sm text-muted-foreground">No images found</p>
          )}
        </div>

        {/* Links */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold">Links</h3>
            <Badge variant="secondary">{content.links.total} total</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="p-3 rounded-lg border bg-card">
              <div className="text-2xl font-bold text-foreground">
                {content.links.total}
              </div>
              <div className="text-xs text-muted-foreground">Total Links</div>
            </div>
            <div className="p-3 rounded-lg border bg-card">
              <div className="text-2xl font-bold text-primary">
                {content.links.internal}
              </div>
              <div className="text-xs text-muted-foreground">
                Internal Links
              </div>
            </div>
            <div className="p-3 rounded-lg border bg-card">
              <div className="text-2xl font-bold text-primary">
                {content.links.external}
              </div>
              <div className="text-xs text-muted-foreground">
                External Links
              </div>
            </div>
          </div>

          {/* Internal Links List */}
          {content.links.internalLinks.length > 0 && (
            <div className="mb-4">
              <button
                onClick={() => setShowInternalLinks(!showInternalLinks)}
                className="flex items-center gap-2 text-sm font-medium mb-3 hover:text-primary transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
                Internal Links ({content.links.internalLinks.length})
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    showInternalLinks ? "rotate-90" : ""
                  }`}
                />
              </button>
              {showInternalLinks && (
                <div className="max-h-64 overflow-y-auto rounded-lg border bg-card">
                  <div className="divide-y">
                    {content.links.internalLinks.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 sm:p-3 hover:bg-accent transition-colors group"
                      >
                        <Badge variant="outline" className="shrink-0 text-xs">
                          #{idx + 1}
                        </Badge>
                        <code className="flex-1 text-xs break-all text-muted-foreground group-hover:text-foreground">
                          {url}
                        </code>
                        <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-50 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* External Links List */}
          {content.links.externalLinks.length > 0 && (
            <div>
              <button
                onClick={() => setShowExternalLinks(!showExternalLinks)}
                className="flex items-center gap-2 text-sm font-medium mb-3 hover:text-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                External Links ({content.links.externalLinks.length})
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    showExternalLinks ? "rotate-90" : ""
                  }`}
                />
              </button>
              {showExternalLinks && (
                <div className="max-h-64 overflow-y-auto rounded-lg border bg-card">
                  <div className="divide-y">
                    {content.links.externalLinks.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 sm:p-3 hover:bg-accent transition-colors group"
                      >
                        <Badge variant="outline" className="shrink-0 text-xs">
                          #{idx + 1}
                        </Badge>
                        <code className="flex-1 text-xs break-all text-muted-foreground group-hover:text-foreground">
                          {url}
                        </code>
                        <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-50 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {content.links.total === 0 && (
            <p className="text-sm text-muted-foreground">No links found</p>
          )}
        </div>
      </div>
    </Card>
  );
}

function HeadingTree({
  node,
  depth = 0,
}: {
  node: HeadingNode;
  depth?: number;
}) {
  const colors: Record<number, string> = {
    1: "text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    2: "text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    3: "text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
    4: "text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    5: "text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    6: "text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  };

  const bgColors: Record<number, string> = {
    1: "bg-purple-50 dark:bg-purple-900/10",
    2: "bg-blue-50 dark:bg-blue-900/10",
    3: "bg-green-50 dark:bg-green-900/10",
    4: "bg-yellow-50 dark:bg-yellow-900/10",
    5: "bg-orange-50 dark:bg-orange-900/10",
    6: "bg-red-50 dark:bg-red-900/10",
  };

  return (
    <div>
      <div
        className={`flex items-start gap-2 p-2 rounded-md border ${
          colors[node.level]
        } ${bgColors[node.level]}`}
        style={{ marginLeft: `${depth * 24}px` }}
      >
        {depth > 0 && (
          <ChevronRight className="w-4 h-4 shrink-0 mt-0.5 opacity-50" />
        )}
        <Badge
          variant="outline"
          className={`shrink-0 text-xs ${colors[node.level]}`}
        >
          H{node.level}
        </Badge>
        <span className="text-xs sm:text-sm font-medium flex-1 wrap-break-word">
          {node.text}
        </span>
      </div>
      {node.children.length > 0 && (
        <div className="space-y-1 mt-1">
          {node.children.map((child, idx) => (
            <HeadingTree key={idx} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
