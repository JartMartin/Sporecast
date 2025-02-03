import { useState, useEffect, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { WheatHeader } from "./components/wheat-header";
import { WheatTimeHorizonContent } from "./components/wheat-time-horizon-content";
import { GeneralInfo } from "./components/general-info";
import { UnsubscribeDialog } from "@/components/dashboard/unsubscribe-dialog";
import { Download, AlertTriangle, Loader2, ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { generatePDF } from "@/lib/pdf";
import { CommodityDetails } from "@/lib/types";
import { Loading3D } from "@/components/ui/loading-3d";

const timeHorizons = [
  { id: "1w", label: "1 Week" },
  { id: "4w", label: "4 Weeks" },
  { id: "12w", label: "12 Weeks" },
  { id: "26w", label: "26 Weeks" },
  { id: "52w", label: "52 Weeks" },
] as const;

type TimeHorizon = typeof timeHorizons[number]["id"];

export function WheatPage() {
  const [selectedHorizon, setSelectedHorizon] = useState<TimeHorizon>("12w");
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showUnsubscribe, setShowUnsubscribe] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [commodityDetails, setCommodityDetails] = useState<CommodityDetails | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        // Get wheat commodity details
        const { data: wheat, error: wheatError } = await supabase
          .from('commodities')
          .select('*')
          .eq('symbol', 'WHEAT')
          .single();

        if (wheatError || !wheat) {
          throw new Error('Wheat commodity not found');
        }

        // Check if user has access
        const { data: portfolio, error: portfolioError } = await supabase
          .from('commodity_portfolio')
          .select('status')
          .eq('user_id', user.id)
          .eq('commodity_id', wheat.id)
          .eq('status', 'active')
          .single();

        if (portfolioError || !portfolio) {
          navigate('/dashboard/store');
          return;
        }

        // Transform commodity data
        const commodityDetails: CommodityDetails = {
          id: wheat.id,
          name: wheat.name,
          symbol: wheat.symbol,
          category: wheat.category,
          market_code: wheat.market_code,
          exchange: wheat.exchange,
          display_name: wheat.display_name,
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
            high: 260,
            current: 201.48
          },
          tradingHours: {
            start: wheat.trading_hours_start,
            end: wheat.trading_hours_end,
            timezone: wheat.trading_hours_timezone
          },
          volume: {
            amount: 12.3,
            unit: "M tons",
            change: 8
          },
          deliveryMonths: wheat.delivery_months || []
        };

        setCommodityDetails(commodityDetails);
        setHasAccess(true);
      } catch (error) {
        console.error('Error checking access:', error);
        navigate('/dashboard/store');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [navigate]);

  const handleUnsubscribe = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: wheat } = await supabase
        .from('commodities')
        .select('id')
        .eq('symbol', 'WHEAT')
        .single();

      if (!wheat) throw new Error('Wheat commodity not found');

      const { error } = await supabase
        .from('commodity_portfolio')
        .update({ status: 'inactive' })
        .eq('user_id', user.id)
        .eq('commodity_id', wheat.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully unsubscribed from Wheat commodity.",
      });

      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Error unsubscribing:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    const success = await generatePDF();
    if (success) {
      toast({
        title: "Success",
        description: "Report downloaded successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    }
    setShowDownloadDialog(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loading3D />
      </div>
    );
  }

  if (!hasAccess || !commodityDetails) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to My Commodities
        </Link>
      </div>

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

      {/* Header */}
      <WheatHeader 
        onDownload={() => setShowDownloadDialog(true)} 
        displayName={commodityDetails.display_name}
      />

      {/* General Information */}
      <GeneralInfo 
        commodity={commodityDetails}
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
              <Suspense fallback={<Loading3D />}>
                <WheatTimeHorizonContent 
                  horizon={horizon.id} 
                  onUnsubscribe={() => setShowUnsubscribe(true)}
                  onSetAlert={() => {}}
                />
              </Suspense>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Unsubscribe Dialog */}
      <UnsubscribeDialog
        open={showUnsubscribe}
        onOpenChange={setShowUnsubscribe}
        commodityName={commodityDetails.display_name}
        commodityId="wheat"
        onConfirm={handleUnsubscribe}
      />
    </div>
  );
}

export default WheatPage;