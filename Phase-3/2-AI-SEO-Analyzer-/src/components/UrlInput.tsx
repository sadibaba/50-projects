import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Rocket, Globe } from "lucide-react";

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

export function UrlInput({
  value,
  onChange,
  onAnalyze,
  loading,
}: UrlInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      onAnalyze();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
      <div className="flex-1 relative">
        <Input
          type="text"
          placeholder="Enter URL (e.g., example.com)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="h-12 text-base pl-11 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent rounded-xl shadow-sm bg-white/90 backdrop-blur-sm"
        />
        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
      <Button
        id="analyze-button"
        onClick={() => onAnalyze()}
        disabled={loading}
        size="lg"
        className="px-8 w-full sm:w-auto h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing
          </>
        ) : (
          <>
            <Rocket className="w-4 h-4 mr-2" />
            Analyze
          </>
        )}
      </Button>
    </div>
  );
}