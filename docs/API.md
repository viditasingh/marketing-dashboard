# ADmyBRAND Insights - API Documentation

## Overview

This document provides comprehensive documentation for the API services, data structures, and utilities used in the ADmyBRAND Insights dashboard.

## Data Types

### AnalyticsData
Main data structure for analytics information.

```typescript
interface AnalyticsData {
  metrics: {
    revenue: number;
    users: number;
    conversions: number;
    growth: number;
  };
  charts: {
    revenue: TimeSeriesData[];
    users: TimeSeriesData[];
    conversions: CategoryData[];
    demographics: CategoryData[];
  };
  table: {
    data: TableRow[];
    pagination: PaginationInfo;
  };
}
```

### TimeSeriesData
Data structure for time-series charts.

```typescript
interface TimeSeriesData {
  date: string;
  value: number;
}
```

### CategoryData
Data structure for category-based charts.

```typescript
interface CategoryData {
  name: string;
  value: number;
  color: string;
}
```

### TableRow
Data structure for table rows.

```typescript
interface TableRow {
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
```

### FilterOptions
Options for filtering analytics data.

```typescript
interface FilterOptions {
  dateRange: "7d" | "30d" | "90d" | "1y";
  status: "all" | "active" | "paused" | "completed";
  campaign: string;
}
```

## API Services

### AnalyticsAPI
Main service for analytics data management.

```typescript
class AnalyticsAPI {
  // Get analytics data with optional filters
  async getAnalytics(filters?: FilterOptions): Promise<AnalyticsAPIResponse>
  
  // Export data in various formats
  async exportData(format: "csv" | "pdf", filters?: FilterOptions): Promise<Blob>
}
```

#### Methods

##### getAnalytics(filters?: FilterOptions)
Fetches analytics data with optional filtering.

**Parameters:**
- `filters` (optional): FilterOptions - Filter criteria for the data

**Returns:**
```typescript
Promise<AnalyticsAPIResponse>
```

**Example:**
```typescript
import { analyticsAPI } from "@/lib/api/analytics";

const response = await analyticsAPI.getAnalytics({
  dateRange: "30d",
  status: "active",
  campaign: "all"
});
```

##### exportData(format, filters?)
Exports analytics data in specified format.

**Parameters:**
- `format`: "csv" | "pdf" - Export format
- `filters` (optional): FilterOptions - Filter criteria

**Returns:**
```typescript
Promise<Blob>
```

**Example:**
```typescript
const csvBlob = await analyticsAPI.exportData("csv", {
  dateRange: "30d"
});
```

## Store Management

### useAnalyticsStore
Zustand store for analytics state management.

```typescript
interface AnalyticsStore {
  data: AnalyticsData | null;
  filters: FilterOptions;
  isLoading: boolean;
  
  // Actions
  updateData: (data: AnalyticsData) => void;
  setFilters: (filters: FilterOptions) => void;
  setLoading: (loading: boolean) => void;
  refreshData: () => void;
}
```

**Usage:**
```typescript
import { useAnalyticsStore } from "@/store/analytics-store";

const { data, filters, isLoading, updateData, setFilters } = useAnalyticsStore();
```

### useThemeStore
Zustand store for theme state management.

```typescript
interface ThemeStore {
  theme: "light" | "dark" | "system";
  
  // Actions
  setTheme: (theme: "light" | "dark" | "system") => void;
}
```

**Usage:**
```typescript
import { useThemeStore } from "@/store/theme-store";

const { theme, setTheme } = useThemeStore();
```

## Custom Hooks

### useAnalytics
Custom hook for analytics data management with real-time updates.

```typescript
interface UseAnalyticsReturn {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  refreshData: () => Promise<void>;
  exportData: (format: "csv" | "pdf") => void;
}
```

**Usage:**
```typescript
import { useAnalytics } from "@/hooks/use-analytics";

const {
  data,
  loading,
  error,
  filters,
  setFilters,
  refreshData,
  exportData
} = useAnalytics();
```

### useTheme
Custom hook for theme management with system preference detection.

```typescript
interface UseThemeReturn {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  toggleTheme: () => void;
  getCurrentTheme: () => "light" | "dark";
  mounted: boolean;
}
```

**Usage:**
```typescript
import { useTheme } from "@/hooks/use-theme";

const { theme, setTheme, toggleTheme, getCurrentTheme } = useTheme();
```

### useLocalStorage
Custom hook for localStorage management with type safety.

```typescript
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void]
```

**Usage:**
```typescript
import { useLocalStorage } from "@/hooks/use-local-storage";

const [value, setValue] = useLocalStorage("my-key", initialValue);
```

## Utility Functions

### Formatting Functions

#### formatCurrency(value: number): string
Formats numbers as currency.

```typescript
import { formatCurrency } from "@/lib/utils";

formatCurrency(1234.56); // "$1,234.56"
formatCurrency(1000000); // "$1,000,000.00"
```

#### formatNumber(value: number): string
Formats numbers with thousands separators.

```typescript
import { formatNumber } from "@/lib/utils";

formatNumber(1234567); // "1,234,567"
formatNumber(1000); // "1,000"
```

#### formatPercentage(value: number): string
Formats numbers as percentages.

```typescript
import { formatPercentage } from "@/lib/utils";

formatPercentage(12.5); // "12.5%"
formatPercentage(0.05); // "5%"
```

### Utility Functions

#### cn(...classes: string[]): string
Combines class names with conditional logic.

```typescript
import { cn } from "@/lib/utils";

const className = cn(
  "base-class",
  condition && "conditional-class",
  "always-present"
);
```

#### getRandomColor(): string
Returns a random color from the chart color palette.

```typescript
import { getRandomColor } from "@/lib/utils";

const color = getRandomColor(); // Returns one of the chart colors
```

## Constants

### APP_CONFIG
Application configuration constants.

```typescript
const APP_CONFIG = {
  name: "ADmyBRAND Insights",
  description: "Modern analytics dashboard for digital marketing agencies",
  version: "1.0.0",
  author: "ADmyBRAND Team",
  website: "https://admybrand.com",
} as const;
```

### API_ENDPOINTS
API endpoint constants.

```typescript
const API_ENDPOINTS = {
  analytics: "/api/analytics",
  export: "/api/export",
  auth: "/api/auth",
} as const;
```

### DATE_RANGES
Available date range options.

```typescript
const DATE_RANGES = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "1y": "Last year",
} as const;
```

### STATUS_OPTIONS
Available status filter options.

```typescript
const STATUS_OPTIONS = {
  all: "All Status",
  active: "Active",
  paused: "Paused",
  completed: "Completed",
} as const;
```

## Error Handling

### Error Messages
Predefined error message constants.

```typescript
const ERROR_MESSAGES = {
  FETCH_FAILED: "Failed to fetch data. Please try again.",
  EXPORT_FAILED: "Failed to export data. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to access this resource.",
  NOT_FOUND: "The requested resource was not found.",
} as const;
```

### Success Messages
Predefined success message constants.

```typescript
const SUCCESS_MESSAGES = {
  DATA_UPDATED: "Data updated successfully.",
  EXPORT_SUCCESS: "Data exported successfully.",
  SETTINGS_SAVED: "Settings saved successfully.",
} as const;
```

## Mock Data

### mockAnalyticsData
Complete mock analytics dataset for development and testing.

```typescript
import { mockAnalyticsData } from "@/lib/mock-data";

// Access different parts of the data
const { metrics, charts, table } = mockAnalyticsData;
```

### Data Generators
Functions for generating realistic mock data.

```typescript
import { generateTimeSeriesData, generateCategoryData, generateTableData } from "@/lib/mock-data";

// Generate time series data
const timeSeriesData = generateTimeSeriesData(1000, 0.1);

// Generate category data
const categoryData = generateCategoryData(["A", "B", "C"], 100);

// Generate table data
const tableData = generateTableData();
```

## Best Practices

1. **Type Safety**: Always use TypeScript interfaces for data structures
2. **Error Handling**: Implement proper error boundaries and error states
3. **Loading States**: Show loading indicators during data fetching
4. **Caching**: Implement appropriate caching strategies for API calls
5. **Validation**: Validate data at API boundaries
6. **Documentation**: Keep API documentation up to date
7. **Testing**: Write comprehensive tests for API services

## Performance Considerations

1. **Lazy Loading**: Load data only when needed
2. **Pagination**: Implement proper pagination for large datasets
3. **Debouncing**: Debounce search and filter inputs
4. **Memoization**: Use React.memo and useMemo for expensive operations
5. **Bundle Splitting**: Split code into smaller chunks
6. **Image Optimization**: Optimize images and assets

## Security

1. **Input Validation**: Validate all user inputs
2. **XSS Prevention**: Sanitize data before rendering
3. **CSRF Protection**: Implement CSRF tokens for API calls
4. **Authentication**: Implement proper authentication mechanisms
5. **Authorization**: Check user permissions for sensitive operations 