import { AnalyticsData, TableRow } from "./types";

// Generate time series data for the last 30 days
function generateTimeSeriesData(baseValue: number, volatility: number = 0.1): Array<{ date: string; value: number }> {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    const value = Math.max(0, baseValue * (1 + randomChange));
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value),
    });
  }
  
  return data;
}

// Generate category data for pie/donut charts
function generateCategoryData(names: string[], baseValue: number): Array<{ name: string; value: number; color: string }> {
  const distinctColors = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Violet
    "#06b6d4", // Cyan
  ];
  
  return names.map((name, index) => ({
    name,
    value: Math.round(baseValue * (0.5 + Math.random() * 1)),
    color: distinctColors[index % distinctColors.length],
  }));
}

// Generate table data
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

  return campaigns.map((campaign, index) => {
    const clicks = Math.floor(Math.random() * 50000) + 1000;
    const impressions = Math.floor(Math.random() * 500000) + 10000;
    const ctr = (clicks / impressions) * 100;
    const cpc = Math.random() * 2 + 0.5;
    const spend = clicks * cpc;
    const conversions = Math.floor(clicks * (Math.random() * 0.1 + 0.02));
    const revenue = conversions * (Math.random() * 200 + 50);
    const roas = revenue / spend;

    return {
      id: `campaign-${index + 1}`,
      campaign,
      clicks,
      impressions,
      ctr: parseFloat(ctr.toFixed(2)),
      cpc: parseFloat(cpc.toFixed(2)),
      spend: parseFloat(spend.toFixed(2)),
      conversions,
      revenue: parseFloat(revenue.toFixed(2)),
      roas: parseFloat(roas.toFixed(2)),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
    revenue: generateTimeSeriesData(9500, 0.15),
    users: generateTimeSeriesData(5200, 0.12),
    conversions: generateCategoryData(
      ["Organic Search", "Paid Search", "Social Media", "Email", "Direct", "Referral"],
      540
    ),
    demographics: generateCategoryData(
      ["18-24", "25-34", "35-44", "45-54", "55+"],
      31284
    ),
    monthlyPerformance: generateCategoryData(
      ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      45000
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