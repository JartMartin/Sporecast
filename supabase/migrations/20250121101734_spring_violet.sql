-- Drop existing commodity_forecasts table if it exists
DROP TABLE IF EXISTS commodity_forecasts;

-- Create commodity_forecasts table
CREATE TABLE commodity_forecasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity_id uuid REFERENCES commodities ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  price decimal NOT NULL,
  is_forecast boolean DEFAULT false,
  confidence_lower decimal,
  confidence_upper decimal,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_confidence CHECK (
    (is_forecast = false AND confidence_lower IS NULL AND confidence_upper IS NULL) OR
    (is_forecast = true AND confidence_lower IS NOT NULL AND confidence_upper IS NOT NULL)
  ),
  UNIQUE(commodity_id, date)
);

-- Enable RLS
ALTER TABLE commodity_forecasts ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing forecasts
CREATE POLICY "Forecasts are viewable by authenticated users"
  ON commodity_forecasts FOR SELECT
  TO authenticated
  USING (true);

-- Create index for better query performance
CREATE INDEX idx_commodity_forecasts_commodity_date 
  ON commodity_forecasts(commodity_id, date);

-- Insert sample data for all available commodities
INSERT INTO commodity_forecasts (commodity_id, date, price, is_forecast, confidence_lower, confidence_upper)
SELECT 
  c.id as commodity_id,
  d.date,
  -- Base price varies by commodity
  CASE c.symbol
    WHEN 'WHEAT' THEN 
      CASE 
        WHEN d.date <= '2025-01-21' THEN 200 + (random() * 20)
        ELSE 220 + (random() * 25)
      END
    WHEN 'MAIZE' THEN 
      CASE 
        WHEN d.date <= '2025-01-21' THEN 180 + (random() * 15)
        ELSE 195 + (random() * 20)
      END
    WHEN 'BARLEY' THEN 
      CASE 
        WHEN d.date <= '2025-01-21' THEN 160 + (random() * 12)
        ELSE 172 + (random() * 18)
      END
    WHEN 'OATS' THEN 
      CASE 
        WHEN d.date <= '2025-01-21' THEN 140 + (random() * 10)
        ELSE 150 + (random() * 15)
      END
  END as price,
  d.date > '2025-01-21' as is_forecast,
  -- Confidence intervals for forecasts
  CASE 
    WHEN d.date > '2025-01-21' THEN
      CASE c.symbol
        WHEN 'WHEAT' THEN 200 + (random() * 20) - 15
        WHEN 'MAIZE' THEN 180 + (random() * 15) - 12
        WHEN 'BARLEY' THEN 160 + (random() * 12) - 10
        WHEN 'OATS' THEN 140 + (random() * 10) - 8
      END
    ELSE NULL
  END as confidence_lower,
  CASE 
    WHEN d.date > '2025-01-21' THEN
      CASE c.symbol
        WHEN 'WHEAT' THEN 200 + (random() * 20) + 15
        WHEN 'MAIZE' THEN 180 + (random() * 15) + 12
        WHEN 'BARLEY' THEN 160 + (random() * 12) + 10
        WHEN 'OATS' THEN 140 + (random() * 10) + 8
      END
    ELSE NULL
  END as confidence_upper
FROM 
  commodities c,
  generate_series('2024-12-21'::date, '2025-02-22'::date, '1 day'::interval) AS d(date)
WHERE 
  c.status = 'available';

-- Add helpful comments
COMMENT ON TABLE commodity_forecasts IS 'Stores historical prices and price forecasts for commodities';
COMMENT ON COLUMN commodity_forecasts.is_forecast IS 'Whether this is a historical price (false) or forecast (true)';
COMMENT ON COLUMN commodity_forecasts.confidence_lower IS 'Lower bound of 90% confidence interval for forecasts';
COMMENT ON COLUMN commodity_forecasts.confidence_upper IS 'Upper bound of 90% confidence interval for forecasts';