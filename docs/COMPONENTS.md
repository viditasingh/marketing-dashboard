# ADmyBRAND Insights - Component Documentation

## Overview

This document provides detailed documentation for all components in the ADmyBRAND Insights dashboard.

## UI Components

### Button
A versatile button component with multiple variants and sizes.

```tsx
import { Button } from "@/components/ui/button";

<Button variant="default" size="default">
  Click me
</Button>
```

**Props:**
- `variant`: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
- `size`: "default" | "sm" | "lg" | "icon"
- `disabled`: boolean
- `children`: ReactNode

### Card
A container component for content with header, content, and footer sections.

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

### Table
A data table component with sorting, filtering, and pagination.

```tsx
import { Table, Column } from "@/components/ui/table";

const columns: Column<YourDataType>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "value", header: "Value", render: (value) => formatValue(value) }
];

<Table
  data={data}
  columns={columns}
  sortConfig={sortConfig}
  onSort={handleSort}
  loading={loading}
/>
```

### Chart
A wrapper component for different chart types with consistent styling.

```tsx
import { Chart } from "@/components/ui/chart";

<Chart title="Revenue Over Time" height={300}>
  <LineChart data={data} />
</Chart>
```

## Dashboard Components

### MetricCard
Displays key performance indicators with change indicators.

```tsx
import { MetricCard } from "@/components/dashboard/metric-card";

<MetricCard
  title="Total Revenue"
  value={284750}
  change={12.5}
  icon={DollarSign}
/>
```

**Props:**
- `title`: string
- `value`: number
- `change`: number (percentage)
- `icon`: LucideIcon
- `className`: string

### ChartWidget
A reusable component for displaying different chart types.

```tsx
import { ChartWidget } from "@/components/dashboard/chart-widget";

<ChartWidget
  title="Revenue Trend"
  type="line"
  data={revenueData}
  height={300}
/>
```

**Props:**
- `title`: string
- `type`: "line" | "bar" | "pie"
- `data`: TimeSeriesData[] | CategoryData[]
- `height`: number
- `className`: string

### DataTable
A comprehensive data table with sorting, filtering, and export functionality.

```tsx
import { DataTable } from "@/components/dashboard/data-table";

<DataTable
  data={tableData}
  pagination={pagination}
  onPageChange={handlePageChange}
  onSort={handleSort}
  onExport={handleExport}
  loading={loading}
/>
```

### OverviewStats
Displays key metrics in a grid layout.

```tsx
import { OverviewStats } from "@/components/dashboard/overview-stats";

<OverviewStats data={analyticsData} />
```

## Layout Components

### Header
Top navigation bar with logo, search, theme toggle, and user menu.

```tsx
import { Header } from "@/components/layout/header";

<Header />
```

### Sidebar
Side navigation with navigation items and quick actions.

```tsx
import { Sidebar } from "@/components/layout/sidebar";

<Sidebar />
```

### Navigation
Navigation component for the sidebar with active states.

```tsx
import { Navigation } from "@/components/layout/navigation";

<Navigation />
```

## Common Components

### LoadingSkeleton
Provides skeleton loading components for different content types.

```tsx
import { MetricCardSkeleton, ChartSkeleton, TableSkeleton } from "@/components/common/loading-skeleton";

<MetricCardSkeleton />
<ChartSkeleton height={300} />
<TableSkeleton rows={5} />
```

### ErrorBoundary
Catches React errors and displays a fallback UI.

```tsx
import { ErrorBoundary } from "@/components/common/error-boundary";

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### ThemeProvider
Client-side theme provider for theme management.

```tsx
import { ThemeProvider } from "@/components/common/theme-provider";

<ThemeProvider>
  <YourApp />
</ThemeProvider>
```

## Hooks

### useAnalytics
Custom hook for analytics data management.

```tsx
import { useAnalytics } from "@/hooks/use-analytics";

const { data, loading, error, filters, setFilters, refreshData, exportData } = useAnalytics();
```

### useTheme
Custom hook for theme management.

```tsx
import { useTheme } from "@/hooks/use-theme";

const { theme, setTheme, toggleTheme, getCurrentTheme } = useTheme();
```

### useLocalStorage
Custom hook for localStorage management.

```tsx
import { useLocalStorage } from "@/hooks/use-local-storage";

const [value, setValue] = useLocalStorage("key", initialValue);
```

## Store

### useThemeStore
Zustand store for theme state management.

```tsx
import { useThemeStore } from "@/store/theme-store";

const { theme, setTheme } = useThemeStore();
```

### useAnalyticsStore
Zustand store for analytics data and filters.

```tsx
import { useAnalyticsStore } from "@/store/analytics-store";

const { data, filters, isLoading, updateData, setFilters } = useAnalyticsStore();
```

## Utilities

### cn
Utility function for combining class names.

```tsx
import { cn } from "@/lib/utils";

const className = cn("base-class", condition && "conditional-class");
```

### Formatting Functions
Utility functions for formatting data.

```tsx
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";

formatCurrency(1234.56); // "$1,234.56"
formatNumber(1234567); // "1,234,567"
formatPercentage(12.5); // "12.5%"
```

## Best Practices

1. **Component Composition**: Use composition over inheritance
2. **Type Safety**: Always use TypeScript interfaces for props
3. **Accessibility**: Include proper ARIA labels and keyboard navigation
4. **Performance**: Use React.memo for expensive components
5. **Testing**: Write unit tests for all components
6. **Documentation**: Keep component documentation up to date

## Styling Guidelines

1. **Design System**: Use the established design system variables
2. **Responsive Design**: Ensure components work on all screen sizes
3. **Dark Mode**: Support both light and dark themes
4. **Animations**: Use consistent animation durations and easing
5. **Focus States**: Include proper focus indicators for accessibility

## Contributing

When adding new components:

1. Create the component in the appropriate directory
2. Add TypeScript interfaces for props
3. Include proper JSDoc comments
4. Add the component to this documentation
5. Write unit tests
6. Update the component index file 