import { Clock, Calendar } from "lucide-react";

interface TradingInfoProps {
  tradingHours: {
    start: string;
    end: string;
    timezone: string;
  };
  deliveryMonths: string[];
}

export function TradingInfo({ tradingHours, deliveryMonths }: TradingInfoProps) {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-emerald-50/50 rounded-lg p-4 border border-teal-100">
      <div className="space-y-4">
        {/* Trading Hours */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-white/80 flex items-center justify-center">
            <Clock className="h-4 w-4 text-teal-600" />
          </div>
          <div>
            <div className="text-sm text-teal-700">Trading Hours</div>
            <div className="font-medium text-teal-900 mt-0.5">
              {tradingHours.start} – {tradingHours.end}
              <span className="text-sm text-teal-600/80 ml-1">
                {tradingHours.timezone}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Months */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-white/80 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-teal-600" />
          </div>
          <div>
            <div className="text-sm text-teal-700">Delivery Months</div>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {deliveryMonths.map((month) => (
                <span 
                  key={month}
                  className="inline-flex items-center rounded-md bg-white/80 px-2 py-1 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-700/10"
                >
                  {month}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}