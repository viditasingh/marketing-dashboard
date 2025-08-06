"use client";

import React from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import ChartWidget from "@/components/dashboard/chart-widget";
import OverviewStats from "@/components/dashboard/overview-stats";
import DataTable from "@/components/dashboard/data-table";
import { useAnalyticsStore } from "@/store/analytics-store";
import { MetricCardSkeleton, ChartSkeleton } from "@/components/common/loading-skeleton";

export default function DashboardPage() {
  const { data, isLoading } = useAnalyticsStore();

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Header />
        <div className="flex flex-col md:flex-row">
          <Sidebar />
          <main className="flex-1 w-full md:ml-64 pt-16 md:pt-0">
            <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6 max-w-full">
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {/* Loading Skeletons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <MetricCardSkeleton key={index} />
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <ChartSkeleton height={280} />
                  <ChartSkeleton height={280} />
                </div>
                <ChartSkeleton height={350} />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    console.log("Page changed to:", page);
  };

  const handleSort = (key: string) => {
    console.log("Sort by:", key);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 w-full md:ml-64 pt-20 md:pt-0">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6 max-w-full">
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              {/* Page Header */}
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 gap-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight truncate">
                    Dashboard
                  </h1>
                  <p className="text-muted-foreground text-xs sm:text-sm md:text-base mt-1">
                    Welcome to your analytics dashboard
                  </p>
                </div>
                {/* Optional action buttons for larger screens */}
                <div className="hidden sm:flex items-center space-x-2">
                  <button className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors">
                    Last 30 days
                  </button>
                </div>
              </div>

              {/* Overview Stats */}
              <OverviewStats data={data} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <ChartWidget
                title="Revenue Trend"
                type="line"
                data={data.charts.revenue}
                height={280}
                className="min-h-[280px]"
              />
              <ChartWidget
                title="User Growth"
                type="line"
                data={data.charts.users}
                height={280}
                className="min-h-[280px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <ChartWidget
                title="Conversion Sources"
                type="pie"
                data={data.charts.conversions}
                height={280}
                className="min-h-[280px]"
              />
              <ChartWidget
                title="Demographics"
                type="pie"
                data={data.charts.demographics}
                height={280}
                className="min-h-[280px]"
              />
            </div>

            {/* Monthly Performance Bar Chart */}
            <div className="w-full">
              <ChartWidget
                title="Monthly Campaign Performance"
                type="bar"
                data={data.charts.monthlyPerformance}
                height={300}
                className="min-h-[300px]"
              />
            </div>

            {/* Data Table */}
            <div className="w-full">
              <DataTable
                data={data.table.data}
                pagination={data.table.pagination}
                onPageChange={handlePageChange}
                onSort={handleSort}
                loading={isLoading}
              />
            </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
