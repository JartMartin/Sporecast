import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface PredictionData {
  date: string;
  price: number;
  confidence_lower?: number;
  confidence_upper?: number;
}

export function WheatPredictionsTable() {
  const [data, setData] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: predictions, error: predictionsError } = await supabase
          .from('wheat_predictions')
          .select('*')
          .order('date', { ascending: false })
          .limit(10);

        if (predictionsError) throw predictionsError;

        setData(predictions);
      } catch (err: any) {
        console.error('Error fetching predictions:', err);
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
        <div className="flex items-center justify-center h-[200px]">
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
      <h3 className="text-lg font-semibold mb-4">Recent Predictions</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Date</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Confidence Range</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b last:border-0">
                <td className="py-2">{new Date(row.date).toLocaleDateString()}</td>
                <td className="text-right">€{row.price.toFixed(2)}</td>
                <td className="text-right">
                  {row.confidence_lower && row.confidence_upper
                    ? `€${row.confidence_lower.toFixed(2)} - €${row.confidence_upper.toFixed(2)}`
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}