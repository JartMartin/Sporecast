import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/features/dashboard/shared/components/stat-card";
import { UnsubscribeDialog } from "./unsubscribe-dialog";
import { AlertDialog } from "./alert-dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { TrendingUp, BarChart2, Percent, Bell } from "lucide-react";
import { Commodity, Forecast } from "@/lib/types";

interface CommodityDashboardProps {
  commodity: Commodity;
  forecasts: Forecast[];
  onUnsubscribe: () => void;
}

export function CommodityDashboard({ commodity, forecasts, onUnsubscribe }: CommodityDashboardProps) {
  const [showUnsubscribe, setShowUnsubscribe] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Calculate latest values for stats
  const latestHistorical = forecasts.find(d => !d.is_forecast)?.price || 0;
  const latestForecast = forecasts.find(d => d.is_forecast)?.price || 0;
  const percentChange = ((latestForecast - latestHistorical) / latestHistorical * 100).toFixed(1);
  const confidenceRange = forecasts.find(d => d.confidence_lower && d.confidence_upper);
  const range = confidenceRange ? 
    `€${confidenceRange.confidence_lower?.toFixed(2)} - €${confidenceRange.confidence_upper?.toFixed(2)}` :
    'N/A';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{commodity.name} Forecast</h1>
        <p className="text-muted-foreground">Real-time price predictions and market insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Predicted Price"
          value={`€${latestForecast.toFixed(2)}`}
          description={`${percentChange}% vs current`}
          icon={<TrendingUp className="h-6 w-6 text-teal-600" />}
        />
        <StatCard 
          title="90% Confidence Range"
          value={range}
          icon={<BarChart2 className="h-6 w-6 text-teal-600" />}
        />
        <StatCard 
          title="Model Confidence"
          value="92%"
          icon={<Percent className="h-6 w-6 text-teal-600" />}
        />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Price Trend</h2>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowAlert(true)}
          >
            <Bell className="h-4 w-4" />
            Set Alert
          </Button>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={forecasts}
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis 
                dataKey="date"
                tick={{ fill: '#666', fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: '#666', fontSize: 12 }}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [`€${Number(value).toFixed(2)}`, 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              
              {/* Historical Line (Solid) */}
              <Line 
                type="monotone"
                dataKey="price"
                stroke="#0d9488"
                strokeWidth={2}
                dot={false}
                connectNulls
              />

              {/* Confidence Interval */}
              <Area
                dataKey="confidence_upper"
                stroke="transparent"
                fill="#0d9488"
                fillOpacity={0.1}
              />
              <Area
                dataKey="confidence_lower"
                stroke="transparent"
                fill="#0d9488"
                fillOpacity={0.1}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-8 mt-6">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-8 bg-teal-600" />
            <span className="text-sm text-neutral-600">Historical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-8 bg-teal-600/10 rounded" />
            <span className="text-sm text-neutral-600">Confidence Range</span>
          </div>
        </div>
      </Card>

      <div className="flex justify-center pt-8">
        <Button
          variant="ghost"
          className="text-sm text-muted-foreground hover:text-destructive"
          onClick={() => setShowUnsubscribe(true)}
        >
          Want to unsubscribe from this commodity?
        </Button>
      </div>

      <UnsubscribeDialog
        open={showUnsubscribe}
        onOpenChange={setShowUnsubscribe}
        commodityName={commodity.name}
        onConfirm={onUnsubscribe}
      />

      <AlertDialog
        open={showAlert}
        onOpenChange={setShowAlert}
        commodityId={commodity.id}
        commodityName={commodity.name}
        currentPrice={latestHistorical}
      />
    </div>
  );
}