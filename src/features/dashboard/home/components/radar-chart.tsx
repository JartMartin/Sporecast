import { ResponsiveContainer, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, Tooltip } from 'recharts';
import { cn } from "@/lib/utils";

interface RadarChartProps {
  data: {
    metric: string;
    selected: number;
    recommended: number;
  }[];
  className?: string;
}

export function RadarChart({ data, className }: RadarChartProps) {
  return (
    <div className={cn("w-full h-full font-sans", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart 
          data={data} 
          margin={{ top: 0, right: 30, bottom: 0, left: 30 }}
          className="[&_.recharts-polar-grid-angle]:stroke-teal-200 [&_.recharts-polar-grid-concentric]:stroke-teal-200"
        >
          <PolarGrid 
            stroke="hsl(var(--teal-200))"
            strokeDasharray="4 4"
          />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ 
              fill: "hsl(var(--muted-foreground))",
              fontSize: 12,
              fontFamily: "inherit"
            }}
          />
          <Radar
            name="Selected"
            dataKey="selected"
            stroke="hsl(var(--teal-600))"
            fill="hsl(var(--teal-600))"
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <Radar
            name="Recommended"
            dataKey="recommended"
            stroke="hsl(var(--emerald-600))"
            fill="hsl(var(--emerald-600))"
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-3 shadow-md">
                    <div className="font-medium mb-1.5 text-sm">
                      {payload[0].payload.metric}
                    </div>
                    <div className="space-y-1">
                      {payload.map((entry: any) => (
                        <div
                          key={entry.name}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ 
                              backgroundColor: entry.name === "Selected" 
                                ? "hsl(var(--teal-600))"
                                : "hsl(var(--emerald-600))"
                            }}
                          />
                          <span className="text-muted-foreground">{entry.name}:</span>
                          <span className="font-medium">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            formatter={(value) => (
              <span className="text-sm text-muted-foreground">{value}</span>
            )}
            iconSize={8}
            wrapperStyle={{
              paddingTop: "1rem"
            }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}