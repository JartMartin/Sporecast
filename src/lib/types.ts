// Auth Types
export interface User {
  id: string;
  email: string;
}

// Profile Types
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'purchase_department' | 'head_of_purchase' | 'board_management' | null;
  company: string | null;
  created_at: string;
  updated_at: string;
}

// Commodity Types
export interface CommodityBase {
  id: string;
  name: string;
  symbol: string;
  marketCode: string;
  exchange: string;
  category: string;
}

export interface PriceRange {
  low: number;
  high: number;
  current: number;
}

export interface TradingHours {
  start: string;
  end: string;
  timezone: string;
}

export interface Specifications {
  minimum: {
    hagbergFallingNumber: number;
    proteinContent: number;
    specificWeight: number;
  };
  basis: {
    moistureContent: number;
    brokenGrains: number;
    impurities: number;
  };
}

export interface CommodityDetails extends CommodityBase {
  displayName: string;
  currentPrice: number;
  priceChange: number;
  percentChange: number;
  weekRange: PriceRange;
  forecastedRange: PriceRange;
  tradingHours: TradingHours;
  volume: {
    amount: number;
    unit: string;
    change: number;
  };
  deliveryMonths: string[];
  specifications: Specifications;
}

export interface PortfolioCommodity extends CommodityBase {
  status: 'active' | 'inactive';
  added_at: string;
  last_viewed_at: string | null;
}

// Forecast Types
export interface Forecast {
  date: string;
  price: number;
  is_forecast: boolean;
  confidence_lower?: number;
  confidence_upper?: number;
}

// Alert Types
export interface Alert {
  id: string;
  commodity_id: string;
  type: 'price_above' | 'price_below';
  threshold: number;
  is_active: boolean;
  commodity: {
    name: string;
  };
  created_at: string;
}