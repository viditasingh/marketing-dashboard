import { create } from "zustand";
import { AnalyticsData, FilterOptions } from "@/lib/types";
import { mockAnalyticsData } from "@/lib/mock-data";

interface AnalyticsState {
  data: AnalyticsData;
  filters: FilterOptions;
  isLoading: boolean;
  updateData: (newData: Partial<AnalyticsData>) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  setLoading: (loading: boolean) => void;
  refreshData: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  data: mockAnalyticsData,
  filters: {
    dateRange: {
      start: null,
      end: null,
    },
    status: [],
    search: "",
  },
  isLoading: false,
  
  updateData: (newData) => {
    set((state) => ({
      data: { ...state.data, ...newData },
    }));
  },
  
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },
  
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
  
  refreshData: () => {
    const { setLoading, updateData } = get();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update some random metrics to simulate real-time data
      const currentData = get().data;
      const updatedMetrics = {
        ...currentData.metrics,
        revenue: currentData.metrics.revenue + Math.floor(Math.random() * 1000 - 500),
        users: currentData.metrics.users + Math.floor(Math.random() * 100 - 50),
        conversions: currentData.metrics.conversions + Math.floor(Math.random() * 10 - 5),
      };
      
      updateData({ metrics: updatedMetrics });
      setLoading(false);
    }, 1000);
  },
})); 