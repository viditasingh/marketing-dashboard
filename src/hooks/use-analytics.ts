import { useState, useEffect, useCallback } from "react";
import { AnalyticsData, FilterOptions } from "@/lib/types";
import { AnalyticsAPI } from "@/lib/api/analytics";

export const useAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: {
      start: null,
      end: null,
    },
    status: [],
    search: "",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const api = AnalyticsAPI.getInstance();
      const response = await api.getAnalytics(filters);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refreshData = async () => {
    await fetchData();
  };

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const exportData = async (format: "csv" | "pdf") => {
    try {
      const api = AnalyticsAPI.getInstance();
      const data = await api.exportData(format, filters);
      const blob = new Blob([data], { 
        type: format === "csv" ? "text/csv" : "application/pdf" 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split("T")[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (data) {
        // Update metrics with small random changes
        setData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            metrics: {
              ...prev.metrics,
              revenue: prev.metrics.revenue + (Math.random() - 0.5) * 100,
              users: prev.metrics.users + Math.floor(Math.random() * 10),
              conversions: prev.metrics.conversions + (Math.random() - 0.5) * 5,
            },
          };
        });
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [data]);

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    refreshData,
    exportData,
  };
}; 