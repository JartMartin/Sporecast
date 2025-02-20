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
  company_id: string | null;
  company_role: 'admin' | 'user' | null;
  created_at: string;
  updated_at: string;
}

// Company Types
export interface Company {
  id: string;
  name: string;
  industry: string;
  subscription_status: 'trial' | 'active' | 'cancelled';
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

// Commodity Types
export interface CommodityBase {
  id: string;
  name: string;
  symbol: string;
  category: string;
  market_code: string;
  exchange: string;
  status: 'available' | 'coming-soon';
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

export interface CommodityDetails extends CommodityBase {
  display_name: string;
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
  approaching_trigger?: boolean;
  progress_to_trigger?: number;
  email_notifications?: boolean;
  commodity: {
    name: string;
  };
  created_at: string;
}

export interface AlertFormData {
  type: 'price_above' | 'price_below';
  threshold: number;
  is_active: boolean;
  email_notifications?: boolean;
}