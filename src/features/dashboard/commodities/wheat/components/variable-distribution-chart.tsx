import { Card } from "@/components/ui/card";
import Plot from "react-plotly.js";

const variableData = [
  { category: "Economic Data", percentage: 40, color: "#0d9488" },  // Base teal-600
  { category: "Climate Data", percentage: 25, color: "#14b8a6" },  // teal-500
  { category: "Commodity Specific", percentage: 15, color: "#2dd4bf" }, // teal-400
  { category: "Technical Indicators", percentage: 10, color: "#5eead4" }, // teal-300
  { category: "Geopolitical Data", percentage: 10, color: "#99f6e4" }, // teal-200
];

export function VariableDistributionChart() {
  return (
    <div className="h-[200px]">
      <Plot
        data={[
          {
            type: "bar",
            x: variableData.map(d => d.percentage),
            y: variableData.map(d => d.category),
            orientation: "h",
            marker: {
              color: variableData.map(d => d.color),
              line: {
                color: "white",
                width: 1
              }
            },
            text: variableData.map(d => d.percentage + "%"),
            textposition: "auto",
            textfont: {
              color: "white",
              size: 12,
              family: "Inter var, sans-serif"
            },
            hovertemplate: "%{y}: %{x}%<extra></extra>",
          },
        ]}
        layout={{
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          font: {
            family: "Inter var, sans-serif",
            size: 12,
          },
          margin: { t: 0, r: 0, b: 0, l: 140 },
          xaxis: {
            showgrid: true,
            gridcolor: "#f1f5f9",
            zeroline: false,
            showticklabels: false,
          },
          yaxis: {
            automargin: true,
            tickfont: {
              color: "#374151", // text-gray-700
            }
          },
          showlegend: false,
          bargap: 0.3,
          hoverlabel: {
            bgcolor: "white",
            font: { family: "Inter var, sans-serif" },
            bordercolor: "#e5e7eb", // border-gray-200
          },
        }}
        config={{
          displayModeBar: false,
          responsive: true,
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}