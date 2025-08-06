export const APP_CONFIG = {
  name: "ADmyBRAND Insights",
  description: "Modern analytics dashboard for digital marketing agencies",
  version: "1.0.0",
  author: "ADmyBRAND Team",
  website: "https://admybrand.com",
} as const;

export const API_ENDPOINTS = {
  analytics: "/api/analytics",
  export: "/api/export",
  auth: "/api/auth",
} as const;

export const DATE_RANGES = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "1y": "Last year",
} as const;

export const STATUS_OPTIONS = {
  all: "All Status",
  active: "Active",
  paused: "Paused",
  completed: "Completed",
} as const;

export const CHART_COLORS = {
  primary: "#6366f1",
  secondary: "#10b981",
  accent: "#f59e0b",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
} as const;

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
} as const;

export const THEME_STORAGE_KEY = "admybrand-theme";
export const ANALYTICS_STORAGE_KEY = "admybrand-analytics-filters";

export const ERROR_MESSAGES = {
  FETCH_FAILED: "Failed to fetch data. Please try again.",
  EXPORT_FAILED: "Failed to export data. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to access this resource.",
  NOT_FOUND: "The requested resource was not found.",
} as const;

export const SUCCESS_MESSAGES = {
  DATA_UPDATED: "Data updated successfully.",
  EXPORT_SUCCESS: "Data exported successfully.",
  SETTINGS_SAVED: "Settings saved successfully.",
} as const; 