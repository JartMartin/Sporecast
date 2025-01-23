import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface ForecastData {
  date: string;
  price: number;
  historicalPrice?: number;
  forecastPrice?: number;
  confidence_lower?: number;
  confidence_upper?: number;
}

interface CommodityForecastsProps {
  commodityId: string;
}

// Chart components with default parameters
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

export function CommodityForecasts({ commodityId }: CommodityForecastsProps) {
  const [data, setData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: forecastData, error: forecastError } = await supabase
          .from('forecasts')
          .select('*')
          .eq('commodity_id', commodityId)
          .order('date', { ascending: true });

        if (forecastError) throw new Error('Failed to fetch forecast data');

        if (!forecastData?.length) {
          throw new Error('No data available for the selected date range');
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
  }, [commodityId]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-[400px] gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          <p className="text-sm text-muted-foreground">Loading forecast data...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-[400px] gap-4">
          <p className="text-sm text-red-500">Error: {error}</p>
          <p className="text-xs text-muted-foreground">Please try again later</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Price Trend</h2>
        <div className="text-sm text-muted-foreground">
          Dec 21, 2024 - Feb 22, 2025
        </div>
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
  );
}