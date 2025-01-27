import { useState } from "react";
import Plot from "react-plotly.js";
import { cn } from "@/lib/utils";

interface TrendAnalysisChartProps {
  className?: string;
  horizon?: string;
}

interface DataSeries {
  name: string;
  color: string;
  visible: boolean;
}

export function TrendAnalysisChart({ className, horizon }: TrendAnalysisChartProps) {
  // Track visibility state for each line
  const [series, setSeries] = useState<DataSeries[]>([
    { name: "Last Quarter", color: "#0d9488", visible: true },
    { name: "Same Quarter Last Year", color: "#f97316", visible: true },
    { name: "5-Year Average", color: "#6b7280", visible: true },
  ]);

  // Generate smoother sample data using cubic interpolation
  const generateData = (basePrice: number, volatility: number, days: number) => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Generate fewer points initially for smoother interpolation
    const controlPoints = 15;
    const pointsPerDay = days / controlPoints;

    for (let i = 0; i < controlPoints; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i * pointsPerDay);
      const noise = (Math.random() - 0.5) * volatility;
      const trend = Math.sin((i / controlPoints) * Math.PI) * 5;
      data.push({
        date: date.toISOString().split('T')[0],
        price: basePrice + trend + noise,
      });
    }

    // Interpolate between points for smoother curve
    const interpolatedData = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Find surrounding control points
      const controlIndex = (i / days) * (controlPoints - 1);
      const index1 = Math.floor(controlIndex);
      const index2 = Math.min(index1 + 1, controlPoints - 1);
      const t = controlIndex - index1;

      // Cubic interpolation
      const price1 = data[index1]?.price || basePrice;
      const price2 = data[index2]?.price || basePrice;
      const interpolatedPrice = price1 * (1 - t) + price2 * t;

      interpolatedData.push({
        date: date.toISOString().split('T')[0],
        price: interpolatedPrice,
      });
    }

    return interpolatedData;
  };

  const lastQuarterData = generateData(200, 10, 90);
  const lastYearData = generateData(180, 8, 90);
  const fiveYearAvgData = generateData(190, 5, 90);

  // Format dates for display
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get today's price from the last data point
  const todayPrice = lastQuarterData[lastQuarterData.length - 1].price;
  const todayDate = formatDate(lastQuarterData[lastQuarterData.length - 1].date);

  // Create present time indicator
  const presentTimeShape = {
    type: 'rect',
    xref: 'x',
    yref: 'paper',
    x0: todayDate,
    x1: todayDate,
    y0: 0,
    y1: 1,
    fillcolor: 'rgba(13, 148, 136, 0.1)',
    line: {
      width: 0,
    },
    layer: 'below'
  };

  return (
    <div className={cn("w-full h-[400px]", className)}>
      <Plot
        data={[
          // Historical trend lines
          {
            x: lastQuarterData.map(d => formatDate(d.date)),
            y: lastQuarterData.map(d => d.price),
            type: "scatter",
            mode: "lines",
            name: "Last Quarter",
            line: { 
              color: series[0].color, 
              width: 2,
              shape: 'spline',
              smoothing: 1.3,
            },
            visible: series[0].visible,
            hovertemplate: "Date: %{x}<br>Price: €%{y:.2f}<extra></extra>",
          },
          {
            x: lastYearData.map(d => formatDate(d.date)),
            y: lastYearData.map(d => d.price),
            type: "scatter",
            mode: "lines",
            name: "Same Quarter Last Year",
            line: { 
              color: series[1].color, 
              width: 2,
              shape: 'spline',
              smoothing: 1.3,
            },
            visible: series[1].visible,
            hovertemplate: "Date: %{x}<br>Price: €%{y:.2f}<extra></extra>",
          },
          {
            x: fiveYearAvgData.map(d => formatDate(d.date)),
            y: fiveYearAvgData.map(d => d.price),
            type: "scatter",
            mode: "lines",
            name: "5-Year Average",
            line: { 
              color: series[2].color, 
              width: 2,
              shape: 'spline',
              smoothing: 1.3,
            },
            visible: series[2].visible,
            hovertemplate: "Date: %{x}<br>Price: €%{y:.2f}<extra></extra>",
          },
        ]}
        layout={{
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
            nticks: 12,
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
              family: "Inter var, sans-serif",
            },
            itemwidth: 60,
            traceorder: "normal",
            itemclick: "toggle",
          },
          hovermode: "x unified",
          hoverlabel: {
            bgcolor: "white",
            font: { family: "Inter var, sans-serif" },
          },
          shapes: [presentTimeShape],
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
        className="w-full h-full"
      />
    </div>
  );
}

export default TrendAnalysisChart;