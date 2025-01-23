import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { UnsubscribeDialog } from "@/components/dashboard/unsubscribe-dialog";
import { AlertDialog } from "@/components/dashboard/alert-dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { supabase } from "@/lib/supabase";
import { TrendingUp, BarChart2, Percent, Bell, Loader2 } from "lucide-react";

interface ForecastData {
  date: string;
  price: number;
  historicalPrice?: number;
  forecastPrice?: number;
  confidence_lower?: number;
  confidence_upper?: number;
}

interface CommodityPageProps {
  name: string;
  commodityId: string;
}

// Chart components with modern React patterns
const CustomXAxis = ({ dataKey = "date", ...props }) => (
  <XAxis 
    dataKey={dataKey}
    tick={{ fill: '#666', fontSize: 12 }}
    tickLine={{ stroke: '#666' }}
    {...props}
  />
);

const CustomYAxis = ({ label = "Price (€)", ...props }) => (
  <YAxis
    tick={{ fill: '#666', fontSize: 12 }}
    tickLine={{ stroke: '#666' }}
    domain={['auto', 'auto']}
    label={{ 
      value: label, 
      angle: -90, 
      position: 'insideLeft',
      style: { fill: '#666' }
    }}
    {...props}
  />
);

const CustomLine = ({ 
  type = "monotone",
  stroke = "#0d9488",
  strokeWidth = 2,
  dot = false,
  ...props 
}) => (
  <Line 
    type={type}
    stroke={stroke}
    strokeWidth={strokeWidth}
    dot={dot}
    {...props}
  />
);

const CustomArea = ({ 
  type = "monotone",
  stroke = "transparent",
  fill = "#0d9488",
  fillOpacity = 0.1,
  ...props 
}) => (
  <Area 
    type={type}
    stroke={stroke}
    fill={fill}
    fillOpacity={fillOpacity}
    {...props}
  />
);

export function CommodityPage({ name, commodityId }: CommodityPageProps) {
  const [showUnsubscribe, setShowUnsubscribe] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [data, setData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the correct table name based on commodity name
        const tableName = `${name.toLowerCase()}_forecasts`;
        
        const { data: forecastData, error: forecastError } = await supabase
          .from(tableName)
          .select('*')
          .order('date', { ascending: true });

        if (forecastError) throw new Error('Failed to fetch forecast data');

        if (!forecastData?.length) {
          throw new Error('No data available');
        }

        // Transform data for the chart
        const transformedData = forecastData.map(d => ({
          date: new Date(d.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          }),
          price: Number(d.price),
          historicalPrice: !d.is_forecast ? Number(d.price) : undefined,
          forecastPrice: d.is_forecast ? Number(d.price) : undefined,
          confidence_lower: d.confidence_lower ? Number(d.confidence_lower) : undefined,
          confidence_upper: d.confidence_upper ? Number(d.confidence_upper) : undefined
        }));

        setData(transformedData);
      } catch (err: any) {
        console.error('Error fetching forecast data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [name]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
          <p className="text-sm text-red-500">Error: {error}</p>
          <p className="text-xs text-muted-foreground">Please try again later</p>
        </div>
      </Card>
    );
  }

  // Calculate latest values for stats
  const latestHistorical = data.find(d => d.historicalPrice)?.price || 0;
  const latestForecast = data.find(d => d.forecastPrice)?.price || 0;
  const percentChange = ((latestForecast - latestHistorical) / latestHistorical * 100).toFixed(1);
  const confidenceRange = data.find(d => d.confidence_lower && d.confidence_upper);
  const range = confidenceRange ? 
    `€${confidenceRange.confidence_lower?.toFixed(2)} - €${confidenceRange.confidence_upper?.toFixed(2)}` :
    'N/A';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{name} Forecast</h1>
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
              data={data}
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <CustomXAxis />
              <CustomYAxis />
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
              <CustomLine 
                dataKey="historicalPrice"
                name="Historical"
                connectNulls
              />

              {/* Forecast Line (Dotted) */}
              <CustomLine 
                dataKey="forecastPrice"
                strokeDasharray="5 5"
                name="Forecast"
                connectNulls
              />

              {/* Confidence Interval */}
              <CustomArea
                dataKey="confidence_upper"
                name="Upper Bound"
              />
              <CustomArea
                dataKey="confidence_lower"
                name="Lower Bound"
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
            <div className="h-0.5 w-8 border-0" style={{ 
              backgroundImage: 'repeating-linear-gradient(to right, #0d9488 0%, #0d9488 33%, transparent 33%, transparent 66%)',
            }} />
            <span className="text-sm text-neutral-600">Forecast</span>
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
        commodityName={name}
        commodityId={commodityId}
      />

      <AlertDialog
        open={showAlert}
        onOpenChange={setShowAlert}
        commodityId={commodityId}
        commodityName={name}
        currentPrice={latestHistorical}
      />
    </div>
  );
}