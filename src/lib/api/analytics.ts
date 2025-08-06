import { AnalyticsData, FilterOptions } from "@/lib/types";
import { mockAnalyticsData } from "@/lib/mock-data";

export interface AnalyticsAPIResponse {
  data: AnalyticsData;
  success: boolean;
  message?: string;
}

export class AnalyticsAPI {
  private static instance: AnalyticsAPI;
  private baseURL: string;

  private constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";
  }

  public static getInstance(): AnalyticsAPI {
    if (!AnalyticsAPI.instance) {
      AnalyticsAPI.instance = new AnalyticsAPI();
    }
    return AnalyticsAPI.instance;
  }

  async getAnalytics(filters?: FilterOptions): Promise<AnalyticsAPIResponse> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let data = { ...mockAnalyticsData };
      
      // Apply filters if provided
      if (filters) {
        data = this.applyFilters(data, filters);
      }
      
      return {
        data,
        success: true,
      };
    } catch (error) {
      return {
        data: mockAnalyticsData,
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch analytics data",
      };
    }
  }

  async exportData(format: "csv" | "pdf", filters?: FilterOptions): Promise<Blob> {
    try {
      const response = await this.getAnalytics(filters);
      
      if (format === "csv") {
        const csvContent = this.generateCSV(response.data);
        return new Blob([csvContent], { type: "text/csv" });
      } else {
        // Simulate PDF generation
        const pdfContent = this.generatePDF(response.data);
        return new Blob([pdfContent], { type: "application/pdf" });
      }
    } catch {
      throw new Error("Failed to export data");
    }
  }

  private applyFilters(data: AnalyticsData, filters: FilterOptions): AnalyticsData {
    const filteredData = { ...data };

    // Apply date range filter
    if (filters.dateRange?.start && filters.dateRange?.end) {
      const daysDiff = Math.ceil((filters.dateRange.end.getTime() - filters.dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
      const multiplier = daysDiff <= 7 ? 0.3 : daysDiff <= 30 ? 0.6 : 1.0;
      filteredData.metrics.revenue = Math.round(filteredData.metrics.revenue * multiplier);
      filteredData.metrics.users = Math.round(filteredData.metrics.users * multiplier);
      filteredData.metrics.conversions = Math.round(filteredData.metrics.conversions * multiplier);
    }

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filteredData.table.data = filteredData.table.data.filter(
        row => filters.status.includes(row.status)
      );
    }

    // Apply search filter
    if (filters.search && filters.search.trim() !== "") {
      filteredData.table.data = filteredData.table.data.filter(
        row => row.campaign.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    return filteredData;
  }

  private generateCSV(data: AnalyticsData): string {
    const headers = ["Campaign", "Clicks", "Impressions", "CTR", "CPC", "Spend", "Conversions", "Revenue", "ROAS", "Status"];
    const rows = data.table.data.map(row => [
      row.campaign,
      row.clicks,
      row.impressions,
      row.ctr,
      row.cpc,
      row.spend,
      row.conversions,
      row.revenue,
      row.roas,
      row.status,
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");
  }

  private generatePDF(data: AnalyticsData): string {
    // Simulate PDF content generation
    return `PDF Report - ${new Date().toISOString()}\n\n` +
           `Revenue: $${data.metrics.revenue.toLocaleString()}\n` +
           `Users: ${data.metrics.users.toLocaleString()}\n` +
           `Conversions: ${data.metrics.conversions.toLocaleString()}\n` +
           `Growth: ${data.metrics.growth}%`;
  }
}

export const analyticsAPI = AnalyticsAPI.getInstance(); 