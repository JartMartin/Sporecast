import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface VolatilityData {
  date: string;
  volatility_index: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export function WheatVolatilityChart() {
  const [data, setData] = useState<VolatilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: volatility, error: volatilityError } = await supabase
          .from('wheat_volatility')
          .select('*')
          .order('date', { ascending: true });

        if (volatilityError) throw volatilityError;

        setData(volatility);
      } catch (err: any) {
        console.error('Error fetching volatility data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">{error}</div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Volatility Index</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
              formatter={(value: any) => [`${value}%`, 'Volatility']}
            />
            <Line 
              type="monotone" 
              dataKey="volatility_index" 
              stroke="#0d9488" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}