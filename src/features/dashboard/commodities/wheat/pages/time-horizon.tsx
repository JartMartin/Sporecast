import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Loader2, ArrowLeft, TrendingUp, BarChart2, Percent } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { WheatPlotlyChart } from "../components/wheat-plotly-chart";

interface TimeHorizonData {
  title: string;
  description: string;
  timeframe: {
    start: Date;
    end: Date;
  };
  metrics: {
    predictedChange: number;
    confidence: number;
    volatility: number;
  };
}

const TIME_HORIZONS: Record<string, TimeHorizonData> = {
  "1w": {
    title: "1 Week Forecast",
    description: "Short-term price movements and market dynamics",
    timeframe: {
      start: new Date(),
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    metrics: {
      predictedChange: 2.5,
      confidence: 94,
      volatility: 12
    }
  },
  "1m": {
    title: "1 Month Forecast",
    description: "Monthly trends and seasonal patterns",
    timeframe: {
      start: new Date(),
      end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    metrics: {
      predictedChange: 4.8,
      confidence: 89,
      volatility: 15
    }
  },
  "1q": {
    title: "1 Quarter Forecast",
    description: "Quarterly market outlook and trends",
    timeframe: {
      start: new Date(),
      end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    },
    metrics: {
      predictedChange: 8.2,
      confidence: 85,
      volatility: 18
    }
  },
  "1y": {
    title: "1 Year Forecast",
    description: "Long-term market projections",
    timeframe: {
      start: new Date(),
      end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    metrics: {
      predictedChange: -3.1,
      confidence: 78,
      volatility: 22
    }
  },
  "1.5y": {
    title: "1.5 Years Forecast",
    description: "Extended market analysis and projections",
    timeframe: {
      start: new Date(),
      end: new Date(Date.now() + 547 * 24 * 60 * 60 * 1000)
    },
    metrics: {
      predictedChange: 12.4,
      confidence: 72,
      volatility: 25
    }
  }
};

export function TimeHorizonPage() {
  const { horizon } = useParams<{ horizon: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Validate horizon
        if (!horizon || !TIME_HORIZONS[horizon]) {
          throw new Error("Invalid time horizon");
        }

        // Here you would fetch specific data for the time horizon
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulated loading
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, [horizon]);

  if (!horizon || !TIME_HORIZONS[horizon]) {
    return (
      <div className="text-center text-red-500">
        Invalid time horizon specified
      </div>
    );
  }

  const horizonData = TIME_HORIZONS[horizon];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Button 
          variant="ghost" 
          className="mb-4 -ml-2 text-muted-foreground"
          onClick={() => navigate('/dashboard/wheat')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Overview
        </Button>
        <h1 className="text-3xl font-bold">{horizonData.title}</h1>
        <p className="text-muted-foreground">{horizonData.description}</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Predicted Change"
          value={`${horizonData.metrics.predictedChange > 0 ? '+' : ''}${horizonData.metrics.predictedChange}%`}
          icon={<TrendingUp className="h-6 w-6 text-teal-600" />}
        />
        <StatCard 
          title="Model Confidence"
          value={`${horizonData.metrics.confidence}%`}
          icon={<Percent className="h-6 w-6 text-teal-600" />}
        />
        <StatCard 
          title="Volatility Index"
          value={horizonData.metrics.volatility.toString()}
          icon={<BarChart2 className="h-6 w-6 text-teal-600" />}
        />
      </div>

      {/* Forecast Chart */}
      <WheatPlotlyChart timeHorizon={horizon} />

      {/* Additional Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Historical Performance</h3>
          <p className="text-sm text-muted-foreground">
            Analysis of past predictions for this time horizon shows a success rate of {horizonData.metrics.confidence}% 
            in accurately predicting price movements. The model has been particularly effective in identifying 
            {horizonData.metrics.predictedChange > 0 ? " upward " : " downward "} trends in this timeframe.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Market Factors</h3>
          <p className="text-sm text-muted-foreground">
            Key factors influencing this forecast include seasonal patterns, global supply chain dynamics, 
            and market sentiment analysis. The volatility index of {horizonData.metrics.volatility} suggests 
            {horizonData.metrics.volatility > 15 ? " increased " : " moderate "} market uncertainty.
          </p>
        </Card>
      </div>
    </div>
  );
}

export default TimeHorizonPage;