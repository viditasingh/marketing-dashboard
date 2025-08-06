import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  // Use explicit locale and options to ensure consistency across server/client
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatNumber(num: number): string {
  // Ensure consistent number formatting
  const roundedNum = Math.round(num);
  if (roundedNum >= 1000000) {
    return Math.round(roundedNum / 1000000 * 10) / 10 + "M";
  }
  if (roundedNum >= 1000) {
    return Math.round(roundedNum / 1000 * 10) / 10 + "K";
  }
  return roundedNum.toString();
}

export function formatPercentage(value: number): string {
  const rounded = Math.round(value * 100) / 100; // More precise rounding
  return `${rounded.toFixed(1)}%`;
}

export function getRandomColor(): string {
  const colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];
  // Use a deterministic approach instead of Math.random()
  const index = Date.now() % colors.length;
  return colors[index];
} 