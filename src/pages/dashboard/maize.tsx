import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { TrendingUp, BarChart2, Percent } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { month: 'Jan', value: 180 },
  { month: 'Feb', value: 185 },
  { month: 'Mar', value: 195 },
  { month: 'Apr', value: 188 },
  { month: 'May', value: 200 },
  { month: 'Jun', value: 205 },
  { month: 'Jul', value: 215 },
  { month: 'Aug', value: 210 },
];

// Chart components with modern React patterns
function CustomXAxis({ dataKey = "month" }) {
  return (
    <XAxis 
      dataKey={dataKey}
      padding={{ left: 0, right: 0 }}
      tick={{ fill: '#666' }}
    />
  );
}

function CustomYAxis() {
  return (
    <YAxis
      padding={{ top: 20, bottom: 20 }}
      tick={{ fill: '#666' }}
    />
  );
}

function CustomLine({ dataKey = "value" }) {
  return (
    <Line 
      type="monotone"
      dataKey={dataKey}
      stroke="#0d9488"
      strokeWidth={2}
      dot={{ fill: '#0d9488' }}
    />
  );
}

export function MaizeDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Maize Forecast</h1>
        <p className="text-muted-foreground">Real-time price predictions and market insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Predicted Price"
          value="€180"
          icon={<TrendingUp className="h-6 w-6 text-teal-600" />}
        />
        <StatCard 
          title="90% Confidence Range"
          value="€170 - €190"
          icon={<BarChart2 className="h-6 w-6 text-teal-600" />}
        />
        <StatCard 
          title="Model Confidence"
          value="89%"
          icon={<Percent className="h-6 w-6 text-teal-600" />}
        />
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Price Trend</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={mockData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <CustomXAxis />
              <CustomYAxis />
              <Tooltip 
                contentStyle={{ 
                  background: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <CustomLine />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}