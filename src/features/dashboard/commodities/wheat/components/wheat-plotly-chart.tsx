import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { supabase } from "@/lib/supabase";
import { Loading3D } from "@/components/ui/loading-3d";

interface WheatPlotlyChartProps {
  timeHorizon?: string;
  className?: string;
}

interface WheatForecast {
  date: string;
  price: number;
  is_forecast: boolean;
  confidence_lower: number | null;
  confidence_upper: number | null;
  price_1y_ago: number | null;
  price_2y_ago: number | null;
}

// Strict mapping of timeframes to table names
const TIME_HORIZON_TABLES = {
  "1w": "wheat_forecasts_1w",
  "4w": "wheat_forecasts_4w",
  "12w": "wheat_forecasts_12w",
  "26w": "wheat_forecasts_26w",
  "52w": "wheat_forecasts_52w"
} as const;

type TimeHorizon = keyof typeof TIME_HORIZON_TABLES;

export function WheatPlotlyChart({ timeHorizon = "12w", className }: WheatPlotlyChartProps) {
  const [data, setData] = useState<WheatForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Type check the timeHorizon
        if (!timeHorizon || !(timeHorizon in TIME_HORIZON_TABLES)) {
          throw new Error(`Invalid time horizon: ${timeHorizon}`);
        }

        const tableName = TIME_HORIZON_TABLES[timeHorizon as TimeHorizon];

        // Get wheat commodity ID first
        const { data: wheat, error: wheatError } = await supabase
          .from('commodities')
          .select('id')
          .eq('symbol', 'WHEAT')
          .single();

        if (wheatError || !wheat) {
          throw new Error('Wheat commodity not found');
        }

        const { data: forecasts, error: forecastError } = await supabase
          .from(tableName)
          .select('*')
          .eq('commodity_id', wheat.id)
          .order('date', { ascending: true });

        if (forecastError) {
          console.error('Supabase error:', forecastError);
          throw new Error(`Error fetching data from ${tableName}`);
        }

        if (!forecasts || forecasts.length === 0) {
          throw new Error(`No data available for ${timeHorizon} forecast`);
        }

        setData(forecasts);
      } catch (err: any) {
        console.error(`Error fetching ${timeHorizon} forecasts:`, err);
        setError(`Connected to ${timeHorizon} forecast table but no data available yet.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeHorizon]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loading3D size="sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] gap-4">
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  // Split data into actual and forecast
  const actualData = data.filter((d) => !d.is_forecast);
  const forecastData = data.filter((d) => d.is_forecast);

  // Format dates for better display
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Plot
      data={[
        // Historical data
        {
          x: actualData.map((d) => formatDate(d.date)),
          y: actualData.map((d) => d.price),
          type: "scatter",
          mode: "lines",
          name: "Historical",
          line: { color: "#0d9488", width: 2 },
          hovertemplate: "Date: %{x}<br>Price: €%{y:.2f}<extra></extra>",
          showlegend: true,
        },
        // Forecast data
        {
          x: forecastData.map((d) => formatDate(d.date)),
          y: forecastData.map((d) => d.price),
          type: "scatter",
          mode: "lines",
          name: "Forecast",
          line: { color: "#0d9488", width: 2, dash: "dash" },
          hovertemplate: "Date: %{x}<br>Price: €%{y:.2f}<extra></extra>",
          showlegend: true,
        },
        // Confidence interval
        {
          x: forecastData.map((d) => formatDate(d.date)),
          y: forecastData.map((d) => d.confidence_lower),
          type: "scatter",
          mode: "lines",
          name: "Confidence Range",
          line: { width: 0 },
          showlegend: false,
          hoverinfo: "skip",
        },
        {
          x: forecastData.map((d) => formatDate(d.date)),
          y: forecastData.map((d) => d.confidence_upper),
          type: "scatter",
          mode: "lines",
          fill: "tonexty",
          fillcolor: "rgba(13, 148, 136, 0.1)",
          name: "Confidence Range",
          line: { width: 0 },
          showlegend: true,
          hoverinfo: "skip",
        },
      ]}
      layout={{
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: {
          family: "Inter var, sans-serif",
        },
        xaxis: {
          title: isMobile ? undefined : "Date",
          gridcolor: "#f1f5f9",
          zeroline: false,
          tickangle: -45,
          nticks: isMobile ? 6 : 10,
          tickformat: "%b %d",
          automargin: true,
          tickfont: {
            size: isMobile ? 10 : 12
          }
        },
        yaxis: {
          title: isMobile ? undefined : "Price per tonne (€)",
          gridcolor: "#f1f5f9",
          zeroline: false,
          tickformat: "€,.0f",
          tickfont: {
            size: isMobile ? 10 : 12
          }
        },
        margin: isMobile ? 
          { t: 10, r: 10, b: 40, l: 50 } : 
          { t: 10, r: 10, b: 80, l: 60 },
        showlegend: true,
        legend: {
          x: 0.5,
          y: isMobile ? -0.3 : -0.2,
          xanchor: "center",
          yanchor: "top",
          orientation: "h",
          bgcolor: "rgba(255,255,255,0)",
          borderwidth: 0,
          font: {
            size: isMobile ? 10 : 12,
            family: "Inter var, sans-serif",
          },
          itemwidth: isMobile ? 100 : 80,
          traceorder: "normal",
        },
        hovermode: "x unified",
        hoverlabel: {
          bgcolor: "white",
          font: { 
            family: "Inter var, sans-serif",
            size: isMobile ? 10 : 12
          },
        },
      }}
      config={{
        responsive: true,
        displaylogo: false,
        displayModeBar: isMobile ? false : "hover",
        modeBarButtonsToRemove: [
          "zoom2d",
          "pan2d",
          "select2d",
          "lasso2d",
          "zoomIn2d",
          "zoomOut2d",
          "autoScale2d",
          "resetScale2d",
          "hoverClosestCartesian",
          "hoverCompareCartesian",
          "toggleSpikelines",
        ],
      }}
      className={className}
      style={{ 
        width: "100%", 
        height: "100%",
        minHeight: isMobile ? "300px" : "400px"
      }}
      useResizeHandler={true}
    />
  );
}

export default WheatPlotlyChart;