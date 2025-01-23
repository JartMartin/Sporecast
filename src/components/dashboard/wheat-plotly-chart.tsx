import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface WheatForecast {
  date: string;
  price: number;
  is_forecast: boolean;
  confidence_lower: number | null;
  confidence_upper: number | null;
}

export function WheatPlotlyChart() {
  const [data, setData] = useState<WheatForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get wheat forecasts directly since we know they're linked to the wheat commodity
        const { data: forecasts, error } = await supabase
          .from('wheat_forecasts')
          .select('*')
          .order('date', { ascending: true });

        if (error) throw error;
        if (!forecasts || forecasts.length === 0) throw new Error('No forecast data available');
        
        setData(forecasts);
      } catch (err: any) {
        console.error('Error fetching wheat forecasts:', err);
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

  // Split data into actual and forecast
  const actualData = data.filter((d) => !d.is_forecast);
  const forecastData = data.filter((d) => d.is_forecast);

  // Format dates for better display
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="p-6">
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
          },
          // Confidence interval
          {
            x: forecastData.map((d) => formatDate(d.date)),
            y: forecastData.map((d) => d.confidence_lower),
            type: "scatter",
            mode: "lines",
            name: "Confidence Lower",
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
            name: "Confidence Interval",
            line: { width: 0 },
            hoverinfo: "skip",
          },
        ]}
        layout={{
          title: {
            text: "Wheat Price Forecast",
            font: {
              family: "Inter var, sans-serif",
              size: 20,
            },
            x: 0.01,
            xanchor: 'left',
          },
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          font: {
            family: "Inter var, sans-serif",
          },
          xaxis: {
            title: "Date",
            gridcolor: "#f1f5f9",
            zeroline: false,
            tickangle: -45,
          },
          yaxis: {
            title: "Price (€)",
            gridcolor: "#f1f5f9",
            zeroline: false,
            tickformat: "€,.2f",
          },
          margin: { t: 40, r: 20, b: 80, l: 60 },
          showlegend: true,
          legend: {
            x: 0,
            y: 1,
            bgcolor: "rgba(255,255,255,0.9)",
            bordercolor: "#e2e8f0",
            borderwidth: 1,
          },
          hovermode: "x unified",
          hoverlabel: {
            bgcolor: "white",
            font: { family: "Inter var, sans-serif" },
          },
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: [
            "lasso2d",
            "select2d",
            "autoScale2d",
          ],
          toImageButtonOptions: {
            format: 'png',
            filename: 'wheat_forecast',
          },
        }}
        style={{ width: "100%", height: "400px" }}
        className="w-full h-[400px]"
      />
    </Card>
  );
}