import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface WheatHeaderProps {
  onDownload: () => void;
  displayName: string;
}

export function WheatHeader({ onDownload, displayName }: WheatHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{displayName} Forecast</h1>
        <p className="text-muted-foreground">Real-time price predictions and market insights</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={onDownload}
      >
        <Download className="h-4 w-4" />
        Download Report
      </Button>
    </div>
  );
}