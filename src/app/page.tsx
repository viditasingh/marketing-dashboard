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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col lg:flex-row">
          <Sidebar />
          <main className="flex-1 p-4 lg:p-6 lg:ml-64 pt-16 lg:pt-4">
            <div className="space-y-4 lg:space-y-6">
              {/* Loading Skeletons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <MetricCardSkeleton key={index} />
                ))}
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                <ChartSkeleton height={300} />
                <ChartSkeleton height={300} />
              </div>
              <ChartSkeleton height={400} />
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
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 lg:ml-64 pt-16 lg:pt-4">
          <div className="space-y-4 lg:space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Welcome to your analytics dashboard
                </p>
              </div>
            </div>

            {/* Overview Stats */}
            <OverviewStats data={data} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
              <ChartWidget
                title="Revenue Trend"
                type="line"
                data={data.charts.revenue}
                height={300}
              />
              <ChartWidget
                title="User Growth"
                type="line"
                data={data.charts.users}
                height={300}
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
              <ChartWidget
                title="Conversion Sources"
                type="pie"
                data={data.charts.conversions}
                height={300}
              />
              <ChartWidget
                title="Demographics"
                type="pie"
                data={data.charts.demographics}
                height={300}
              />
            </div>

            {/* Monthly Performance Bar Chart */}
            <div className="grid grid-cols-1 gap-4 lg:gap-6">
              <ChartWidget
                title="Monthly Campaign Performance"
                type="bar"
                data={data.charts.monthlyPerformance}
                height={350}
              />
            </div>

            {/* Data Table */}
            <div className="w-full overflow-hidden">
              <DataTable
                data={data.table.data}
                pagination={data.table.pagination}
                onPageChange={handlePageChange}
                onSort={handleSort}
                loading={isLoading}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
