import { BarChart2 } from "lucide-react";

interface VolumeCardProps {
  amount: number;
  unit: string;
  change: number;
  timeframe: string;
}

export function VolumeCard({ amount, unit, change, timeframe }: VolumeCardProps) {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-emerald-50/50 rounded-lg p-4 border border-teal-100">
      <div className="flex items-center gap-2 text-sm text-teal-700 mb-2">
        <BarChart2 className="h-4 w-4" />
        Volume
      </div>
      <div className="text-2xl font-bold text-teal-900">
        {amount}{unit}
      </div>
      <div className="text-sm text-emerald-600 font-medium mt-1">
        +{change}% from last {timeframe}
      </div>
    </div>
  );
}