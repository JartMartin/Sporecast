import { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Download, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Loading3D } from "@/components/ui/loading-3d";
import { generatePDF } from "@/lib/pdf";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { WheatTimeHorizonContent } from "./components/wheat-time-horizon-content";
import { UnsubscribeDialog } from "./components/unsubscribe-dialog";
import { GeneralInfo } from "./components/general-info";
import { CommodityDetails } from "@/lib/types";

const timeHorizons = [
  { id: "1w", label: "1 Week" },
  { id: "4w", label: "4 Weeks" },
  { id: "12w", label: "12 Weeks" },
  { id: "26w", label: "26 Weeks" },
  { id: "52w", label: "52 Weeks" },
] as const;

type TimeHorizon = typeof timeHorizons[number]["id"];

// Mock commodity data
const mockCommodityData: CommodityDetails = {
  id: "wheat-1",
  name: "Wheat",
  symbol: "WHEAT",
  displayName: "Milling Wheat / Blé de Meunerie",
  marketCode: "EBM",
  exchange: "Euronext",
  category: "Cereals",
  currentPrice: 201.48,
  priceChange: 4.82,
  percentChange: 2.4,
  weekRange: {
    low: 180,
    high: 245,
    current: 201.48
  },
  forecastedRange: {
    low: 195,
    high: 255,
    current: 201.48
  },
  tradingHours: {
    start: "10:45",
    end: "18:30",
    timezone: "CET"
  },
  volume: {
    amount: 12.3,
    unit: "M tons",
    change: 8
  },
  deliveryMonths: ["MAR", "MAY", "SEP", "DEC"],
  specifications: {
    minimum: {
      hagbergFallingNumber: 220,
      proteinContent: 11,
      specificWeight: 76
    },
    basis: {
      moistureContent: 15,
      brokenGrains: 4,
      impurities: 2
    }
  }
};

export function DynamicCommodityPage() {
  const { commodity } = useParams();
  const navigate = useNavigate();
  const [selectedHorizon, setSelectedHorizon] = useState<TimeHorizon>("12w");
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showUnsubscribe, setShowUnsubscribe] = useState(false);
  const { toast } = useToast();

  // Redirect if not wheat for now
  if (commodity?.toLowerCase() !== 'wheat') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleDownload = async () => {
    setShowDownloadDialog(false);
    
    // Show loading toast
    toast({
      title: "Generating Report",
      description: "Please wait while we prepare your report...",
    });

    // Generate and download PDF
    const success = await generatePDF();

    // Show result toast
    if (success) {
      toast({
        title: "Report Downloaded",
        description: "Your market report has been downloaded successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUnsubscribe = async () => {
    try {
      // Unsubscribe logic here
      toast({
        title: "Successfully Unsubscribed",
        description: "Wheat has been removed from your portfolio.",
      });
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
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
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              <div className="font-medium mb-2">Important:</div>
              <div>
                This report contains confidential market analysis and proprietary forecasting data. 
                By downloading this report, you agree to:
              </div>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Not share or distribute this report with third parties</li>
                <li>Use the information solely for internal business purposes</li>
                <li>Maintain the confidentiality of the data and analysis</li>
              </ul>
            </div>
            <div className="text-sm text-muted-foreground">
              Violation of these terms may result in the suspension of your account and legal action.
            </div>
          </div>
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

      {/* Unsubscribe Dialog */}
      <UnsubscribeDialog
        open={showUnsubscribe}
        onOpenChange={setShowUnsubscribe}
        commodityName="Milling Wheat / Blé de Meunerie"
        onConfirm={handleUnsubscribe}
      />

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

        {/* General Information Section */}
        <div className="space-y-1 mb-4">
          <h2 className="text-xl font-semibold">General Information</h2>
          <p className="text-sm text-muted-foreground">
            Key market details and current trading information
          </p>
        </div>

        <GeneralInfo 
          commodity={mockCommodityData}
          selectedTimeframe={selectedHorizon}
        />

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
                <WheatTimeHorizonContent 
                  horizon={horizon.id}
                  onUnsubscribe={() => setShowUnsubscribe(true)}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default DynamicCommodityPage;