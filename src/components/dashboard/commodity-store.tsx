import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AddCommodityDialog } from "./add-commodity-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface Commodity {
  id: string;
  name: string;
  category: string;
  status: "available" | "portfolio" | "coming-soon";
  marketCode: string;
  exchange: string;
}

const exchanges = [
  { value: "cme", label: "Chicago Mercantile Exchange (CME)" },
  { value: "euronext", label: "Euronext" },
  { value: "ice", label: "Intercontinental Exchange (ICE)" },
];

export function CommodityStore() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommodity, setSelectedCommodity] = useState<Commodity | null>(null);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch commodities and user's portfolio
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Get all commodities
        const { data: allCommodities, error: commoditiesError } = await supabase
          .from('commodities')
          .select('*');

        if (commoditiesError) throw commoditiesError;

        // Get user's commodities
        const { data: userCommodities, error: userError } = await supabase
          .from('user_commodities')
          .select('commodity_id, status')
          .eq('user_id', user.id);

        if (userError) throw userError;

        // Map commodities with portfolio status
        const mappedCommodities = allCommodities.map(commodity => ({
          id: commodity.id,
          name: commodity.name,
          category: commodity.category || 'Other',
          marketCode: commodity.market_code,
          exchange: commodity.exchange,
          status: userCommodities.find(uc => uc.commodity_id === commodity.id)
            ? 'portfolio'
            : commodity.status || 'available'
        }));

        setCommodities(mappedCommodities);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRequestForm(false);
    toast({
      title: "Request Submitted",
      description: "Thank you! Your request has been submitted and is under review.",
    });
  };

  const filteredCommodities = commodities.filter((commodity) =>
    commodity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedCommodities = filteredCommodities.reduce((acc, commodity) => {
    const category = commodity.status === "coming-soon" ? "Coming Soon" : commodity.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(commodity);
    return acc;
  }, {} as Record<string, Commodity[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  const CommodityCard = ({ commodity }: { commodity: Commodity }) => (
    <Card className="flex flex-col">
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="min-w-0">
            <h3 className="font-medium truncate">{commodity.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">
                {commodity.marketCode}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {commodity.exchange}
              </span>
            </div>
          </div>
          {commodity.status === "coming-soon" && (
            <span className="flex-shrink-0 text-xs font-medium bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
              Soon
            </span>
          )}
          {commodity.status === "portfolio" && (
            <span className="flex-shrink-0 text-xs font-medium bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">
              Added
            </span>
          )}
        </div>
        <Button
          className="w-full mt-auto"
          variant={commodity.status === "portfolio" ? "outline" : "default"}
          size="sm"
          disabled={commodity.status !== "available"}
          onClick={() => {
            if (commodity.status === "available") {
              setSelectedCommodity(commodity);
            }
          }}
        >
          {commodity.status === "portfolio"
            ? "In Portfolio"
            : commodity.status === "coming-soon"
            ? "Coming Soon"
            : "Add to Portfolio"}
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <Link
          to="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 w-fit"
        >
          <ChevronLeft className="h-4 w-4" /> Back to My Portfolio
        </Link>
        <h1 className="text-3xl font-bold">Commodity Store</h1>
        <p className="text-muted-foreground">
          Browse and add commodities to your portfolio
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search commodities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
          <DialogTrigger asChild>
            <Button className="gap-2 whitespace-nowrap">
              <Plus className="h-4 w-4" /> Request Commodity
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request a New Commodity</DialogTitle>
              <DialogDescription>
                Fill out the form below to request a new commodity for the platform.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="commodity-name">Commodity Name *</Label>
                <Input
                  id="commodity-name"
                  placeholder="Enter commodity name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="market-code">Market Code *</Label>
                <Input
                  id="market-code"
                  placeholder="e.g., ZW for Wheat"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exchange">Exchange *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an exchange" />
                  </SelectTrigger>
                  <SelectContent>
                    {exchanges.map((exchange) => (
                      <SelectItem key={exchange.value} value={exchange.value}>
                        {exchange.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="details">Additional Details</Label>
                <Textarea
                  id="details"
                  placeholder="Any specific requirements or information..."
                  className="min-h-[100px]"
                />
              </div>
              <Button type="submit" className="w-full">Submit Request</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedCommodities).map(([category, commodities]) => (
          commodities.length > 0 && (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {commodities.map((commodity) => (
                  <CommodityCard key={commodity.id} commodity={commodity} />
                ))}
              </div>
            </div>
          )
        ))}
        
        {filteredCommodities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No commodities found matching your search.</p>
          </div>
        )}
      </div>

      {selectedCommodity && (
        <AddCommodityDialog
          open={!!selectedCommodity}
          onOpenChange={() => setSelectedCommodity(null)}
          commodityId={selectedCommodity.id}
          commodityName={selectedCommodity.name}
        />
      )}
    </div>
  );
}