import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { WheatHeader } from "./components/wheat-header";
import { WheatPlotlyChart } from "./components/wheat-plotly-chart";
import { WheatTimeHorizonContent } from "./components/wheat-time-horizon-content";
import { Download, AlertTriangle } from "lucide-react";

const timeHorizons = [
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "quarter", label: "Quarter" },
  { id: "6month", label: "6 Months" },
  { id: "year", label: "Year" },
] as const;

type TimeHorizon = typeof timeHorizons[number]["id"];

export function WheatPage() {
  const [selectedHorizon, setSelectedHorizon] = useState<TimeHorizon>("quarter");
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);

  const handleDownload = () => {
    setShowDownloadDialog(false);
  };

  return (
    <div className="min-h-screen">
      {/* Download Warning Dialog */}
      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              Confidentiality Notice
            </DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                <p className="font-medium mb-2">Important:</p>
                <p>
                  This report contains confidential market analysis and proprietary forecasting data. 
                  By downloading this report, you agree to:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Not share or distribute this report with third parties</li>
                  <li>Use the information solely for internal business purposes</li>
                  <li>Maintain the confidentiality of the data and analysis</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                Violation of these terms may result in the suspension of your account and legal action.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setShowDownloadDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-[#F5F7FA]/95 backdrop-blur-sm pb-4">
        {/* Download Report Button */}
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-2 border-teal-600/20 hover:border-teal-600/40 bg-white hover:bg-teal-50/50"
            onClick={() => setShowDownloadDialog(true)}
          >
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>

        {/* General Information Section Title */}
        <div className="space-y-1 mb-4">
          <h2 className="text-xl font-semibold">General Information</h2>
          <p className="text-sm text-muted-foreground">
            Key market details and current trading information
          </p>
        </div>

        {/* General Information Card */}
        <Card className="p-6 mb-6">
          <div className="space-y-6">
            {/* Title and Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Name and Exchange */}
              <div className="lg:col-span-2">
                <h1 className="text-2xl font-bold">Milling Wheat (MATIF)</h1>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm px-2 py-0.5 bg-neutral-100 rounded-md font-medium">
                    MWT
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Euronext Paris
                  </span>
                </div>
              </div>

              {/* Current Price */}
              <Card className="p-4 bg-teal-50/50 border-teal-100">
                <div className="text-sm font-medium text-teal-600 mb-1">
                  Current Price
                </div>
                <div className="text-2xl font-bold text-teal-700">€201.48</div>
                <div className="text-sm font-medium text-emerald-600 mt-1">
                  +2.4% last 3M
                </div>
              </Card>
            </div>

            {/* Price Range and Volume */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 52W Range */}
              <Card className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-4">
                  52W Range
                </div>
                <div className="relative">
                  <div className="h-2 bg-neutral-100 rounded-full">
                    <div 
                      className="absolute h-2 bg-teal-100 rounded-full"
                      style={{ width: "40%", left: "20%" }}
                    />
                    <div 
                      className="absolute h-4 w-4 top-1/2 -translate-y-1/2 bg-teal-600 rounded-full border-2 border-white shadow-sm"
                      style={{ left: "40%" }}
                    />
                  </div>
                  <div className="flex justify-between mt-4 text-sm">
                    <span className="font-medium text-neutral-600">€180</span>
                    <span className="font-medium text-teal-600">€201.48</span>
                    <span className="font-medium text-neutral-600">€245</span>
                  </div>
                </div>
              </Card>

              {/* Volume */}
              <Card className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Volume (3M)
                </div>
                <div className="text-2xl font-semibold">12.3M tons</div>
                <div className="text-sm font-medium text-emerald-600 mt-1">
                  +8% last 3M
                </div>
              </Card>
            </div>

            <div className="text-xs text-muted-foreground">
              Last Updated: 2025-01-22 10:00 AM CET
            </div>
          </div>
        </Card>

        {/* Time Horizon Tabs */}
        <div className="mt-6">
          <Tabs 
            value={selectedHorizon} 
            onValueChange={(value) => setSelectedHorizon(value as TimeHorizon)}
            className="w-full"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="inline-flex items-center rounded-full px-3 py-1 bg-teal-50/50 border border-teal-100/50">
                <span className="text-sm text-teal-600/80 font-medium">
                  Select preferred scope
                </span>
              </div>
              <TabsList className="bg-white border-2 border-teal-100 rounded-xl h-12 p-1.5 shadow-sm">
                {timeHorizons.map((horizon) => (
                  <TabsTrigger
                    key={horizon.id}
                    value={horizon.id}
                    className={cn(
                      "px-6 h-9 text-sm font-medium rounded-lg transition-all duration-200",
                      "data-[state=active]:bg-gradient-to-br data-[state=active]:from-teal-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white",
                      "data-[state=active]:shadow-sm",
                      "hover:text-teal-700 data-[state=active]:hover:text-white"
                    )}
                  >
                    {horizon.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Tab Content */}
            {timeHorizons.map((horizon) => (
              <TabsContent 
                key={horizon.id} 
                value={horizon.id}
                className="mt-6"
              >
                <WheatTimeHorizonContent horizon={horizon.id} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default WheatPage;