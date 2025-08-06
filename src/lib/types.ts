export interface MetricCard {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: "positive" | "negative" | "neutral";
  format: "currency" | "number" | "percentage";
  icon: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface ChartData {
  revenue: TimeSeriesData[];
  users: TimeSeriesData[];
  conversions: CategoryData[];
  demographics: CategoryData[];
  monthlyPerformance: CategoryData[];
}

export interface TableRow {
  id: string;
  campaign: string;
  clicks: number;
  impressions: number;
  ctr: number;
  cpc: number;
  spend: number;
  conversions: number;
  revenue: number;
  roas: number;
  status: "active" | "paused" | "completed";
  date: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface AnalyticsData {
  metrics: {
    revenue: number;
    users: number;
    conversions: number;
    growth: number;
  };
  charts: ChartData;
  table: {
    data: TableRow[];
    pagination: PaginationInfo;
  };
}

export interface FilterOptions {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  status: string[];
  search: string;
}

export type Theme = "light" | "dark" | "system"; 