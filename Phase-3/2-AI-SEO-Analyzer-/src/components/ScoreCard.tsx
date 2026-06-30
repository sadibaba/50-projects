import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Zap, 
  Sparkles,
  TrendingUp,
  Trophy
} from "lucide-react";

interface ScoreCardProps {
  score: number;
}

export function ScoreCard({ score }: ScoreCardProps) {
  const getScoreStatus = (score: number) => {
    if (score >= 80)
      return {
        label: "Excellent",
        color: "text-green-600",
        bg: "bg-green-100",
        icon: Trophy,
        variant: "default" as const,
      };
    if (score >= 60)
      return {
        label: "Good",
        color: "text-blue-600",
        bg: "bg-blue-100",
        icon: TrendingUp,
        variant: "default" as const,
      };
    if (score >= 40)
      return {
        label: "Needs Improvement",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        icon: AlertCircle,
        variant: "secondary" as const,
      };
    return {
      label: "Poor",
      color: "text-red-600",
      bg: "bg-red-100",
      icon: XCircle,
      variant: "destructive" as const,
    };
  };

  const status = getScoreStatus(score);
  const Icon = status.icon;

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-green-400 to-green-600";
    if (score >= 60) return "bg-gradient-to-r from-blue-400 to-indigo-600";
    if (score >= 40) return "bg-gradient-to-r from-yellow-400 to-orange-500";
    return "bg-gradient-to-r from-red-400 to-red-600";
  };

  return (
    <Card className="p-6 sm:p-8 border-0 shadow-xl bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-1 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600" />
            AI-Powered SEO Score
          </h2>
          <p className="text-sm text-muted-foreground">
            Overall SEO health analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={status.variant} className={`text-sm px-4 py-2 ${status.bg}`}>
            {status.label}
          </Badge>
          <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            AI
          </Badge>
        </div>
      </div>

      <div className="flex items-end gap-4 sm:gap-6 mb-4">
        <div className="flex items-baseline gap-2">
          <span className={`text-5xl sm:text-6xl lg:text-7xl font-bold ${status.color}`}>
            {score}
          </span>
          <span className="text-2xl sm:text-3xl text-muted-foreground font-medium">
            /100
          </span>
        </div>
        <Icon className={`w-10 h-10 sm:w-12 sm:h-12 ${status.color}`} />
      </div>

      <Progress 
        value={score} 
        className={`h-3 rounded-full bg-gray-200 ${getProgressColor(score)}`}
      />
      
      <div className="mt-4 flex justify-between text-xs text-muted-foreground">
        <span>Needs Work</span>
        <span>Good</span>
        <span>Excellent</span>
      </div>
    </Card>
  );
}