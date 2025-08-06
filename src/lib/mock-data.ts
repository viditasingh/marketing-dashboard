import { AnalyticsData, TableRow } from "./types";

// Deterministic random number generator for consistent SSR/Client rendering
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

// Generate time series data for the last 30 days with deterministic values
function generateTimeSeriesData(baseValue: number, volatility: number = 0.1, seed: number = 12345): Array<{ date: string; value: number }> {
  const data = [];
  const today = new Date();
  const rng = new SeededRandom(seed);
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const randomChange = (rng.next() - 0.5) * 2 * volatility;
    const value = Math.max(0, baseValue * (1 + randomChange));
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value),
    });
  }
  
  return data;
}

// Generate category data for pie/donut charts with deterministic values
function generateCategoryData(names: string[], baseValue: number, seed: number = 54321): Array<{ name: string; value: number; color: string }> {
  const distinctColors = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Violet
    "#06b6d4", // Cyan
  ];
  
  const rng = new SeededRandom(seed);
  
  return names.map((name, index) => ({
    name,
    value: Math.round(baseValue * (0.5 + rng.next() * 1)),
    color: distinctColors[index % distinctColors.length],
  }));
}

// Generate table data with deterministic values
function generateTableData(): TableRow[] {
  const campaigns = [
    "Summer Sale Campaign",
    "Brand Awareness Q2",
    "Product Launch 2024",
    "Holiday Special",
    "Social Media Boost",
    "Email Newsletter",
    "Retargeting Campaign",
    "Influencer Partnership",
    "Search Ads Campaign",
    "Display Network",
    "Video Campaign",
    "Mobile App Install",
  ];

  const statuses: Array<"active" | "paused" | "completed"> = ["active", "paused", "completed"];
  const rng = new SeededRandom(98765); // Fixed seed for table data

  return campaigns.map((campaign, index) => {
    const clicks = Math.floor(rng.next() * 50000) + 1000;
    const impressions = Math.floor(rng.next() * 500000) + 10000;
    const ctr = (clicks / impressions) * 100;
    const cpc = rng.next() * 2 + 0.5;
    const spend = clicks * cpc;
    const conversions = Math.floor(clicks * (rng.next() * 0.1 + 0.02));
    const revenue = conversions * (rng.next() * 200 + 50);
    const roas = revenue / spend;

    return {
      id: `campaign-${index + 1}`,
      campaign,
      clicks: Math.round(clicks),
      impressions: Math.round(impressions),
      ctr: parseFloat(ctr.toFixed(2)),
      cpc: parseFloat(cpc.toFixed(2)),
      spend: parseFloat(spend.toFixed(2)),
      conversions: Math.round(conversions),
      revenue: parseFloat(revenue.toFixed(2)),
      roas: parseFloat(roas.toFixed(2)),
      status: statuses[Math.floor(rng.next() * statuses.length)],
      date: new Date(Date.now() - rng.next() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
  });
}

export const mockAnalyticsData: AnalyticsData = {
  metrics: {
    revenue: 284750,
    users: 156420,
    conversions: 3240,
    growth: 12.5,
  },
  charts: {
    revenue: generateTimeSeriesData(9500, 0.15, 11111),
    users: generateTimeSeriesData(5200, 0.12, 22222),
    conversions: generateCategoryData(
      ["Organic Search", "Paid Search", "Social Media", "Email", "Direct", "Referral"],
      540,
      33333
    ),
    demographics: generateCategoryData(
      ["18-24", "25-34", "35-44", "45-54", "55+"],
      31284,
      44444
    ),
    monthlyPerformance: generateCategoryData(
      ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      45000,
      55555
    ),
  },
  table: {
    data: generateTableData(),
    pagination: {
      currentPage: 1,
      totalPages: 2,
      totalItems: 12,
      itemsPerPage: 10,
    },
  },
};

// Export individual data for easier access
export const mockMetrics = mockAnalyticsData.metrics;
export const mockChartData = mockAnalyticsData.charts;
export const mockTableData = mockAnalyticsData.table.data; 