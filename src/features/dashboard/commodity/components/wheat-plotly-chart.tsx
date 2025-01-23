import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface WheatForecast {
  date: string;
  price: number;
  is_forecast: boolean;
  confidence_lower: number | null;
  confidence_upper: number | null;
}

interface WheatPlotlyChartProps {
  timeHorizon?: string;
  className?: string;
}

export function WheatPlotlyChart({ timeHorizon, className }: WheatPlotlyChartProps) {
  const [data, setData] = useState<WheatForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: forecasts, error } = await supabase
          .from("wheat_forecasts")
          .select("*")
          .order("date", { ascending: true });

        if (error) throw error;
        if (!forecasts || forecasts.length === 0) throw new Error("No forecast data available");

        setData(forecasts);
      } catch (err: any) {
        console.error("Error fetching wheat forecasts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        <p className="text-sm text-muted-foreground">Loading forecast data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-sm text-red-500">Error: {error}</p>
        <p className="text-xs text-muted-foreground">Please try again later</p>
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
        // Remove title since it's already in the header
        title: undefined,
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: {
          family: "Inter, sans-serif",
        },
        xaxis: {
          title: "Date",
          gridcolor: "#f1f5f9",
          zeroline: false,
          tickangle: -45,
          nticks: 10,
          tickformat: "%b %d",
          automargin: true,
        },
        yaxis: {
          title: "Price per tonne (€)",
          gridcolor: "#f1f5f9",
          zeroline: false,
          tickformat: "€,.2f",
        },
        margin: { t: 10, r: 10, b: 80, l: 60 },
        showlegend: true,
        legend: {
          x: 0.5,
          y: -0.2,
          xanchor: "center",
          yanchor: "top",
          orientation: "h",
          bgcolor: "rgba(255,255,255,0)",
          borderwidth: 0,
          font: {
            size: 12,
            family: "Inter, sans-serif",
          },
          itemwidth: 80,
          traceorder: "normal",
        },
        hovermode: "x unified",
        hoverlabel: {
          bgcolor: "white",
          font: { family: "Inter, sans-serif" },
        },
      }}
      config={{
        responsive: true,
        displaylogo: false,
        displayModeBar: "hover",
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
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export default WheatPlotlyChart;