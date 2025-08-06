import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TimeSeriesData, CategoryData } from "@/lib/types";

interface ChartWidgetProps {
  title: string;
  type: "line" | "bar" | "pie";
  data: TimeSeriesData[] | CategoryData[];
  className?: string;
  height?: number;
}

const ChartWidget: React.FC<ChartWidgetProps> = ({
  title,
  type,
  data,
  className,
  height = 300,
}) => {
  // Distinct colors for better visualization
  const distinctColors = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Violet
    "#06b6d4", // Cyan
    "#f97316", // Orange
    "#84cc16", // Lime
    "#ec4899", // Pink
    "#6366f1", // Indigo
  ];

  // Common tooltip styling for better dark theme visibility
  const tooltipStyle = {
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    color: "var(--foreground)",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: "500",
  };

  const labelStyle = {
    color: "var(--foreground)",
    fontWeight: "600",
    fontSize: "14px",
  };

  const itemStyle = {
    color: "var(--foreground)",
    fontSize: "12px",
  };

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data as TimeSeriesData[]}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={labelStyle}
                itemStyle={itemStyle}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ fill: "var(--primary)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "var(--primary)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data as CategoryData[]}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={labelStyle}
                itemStyle={itemStyle}
              />
              <Bar
                dataKey="value"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data as CategoryData[]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {(data as CategoryData[]).map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={distinctColors[index % distinctColors.length]} 
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={labelStyle}
                itemStyle={itemStyle}
              />
              <Legend 
                wrapperStyle={{
                  color: "var(--foreground)",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Unsupported chart type</p>
          </div>
        );
    }
  };

  const chartContent = renderChart();

  return (
    <Card className={cn("card-hover w-full", className)}>
      <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-4 lg:px-6">
        <CardTitle className="text-sm sm:text-base lg:text-lg font-semibold truncate">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6">
        <div className="w-full overflow-hidden" style={{ minHeight: height }}>
          {type === "line" || type === "bar" || type === "pie" ? (
            <ResponsiveContainer width="100%" height={height}>
              {chartContent}
            </ResponsiveContainer>
          ) : (
            chartContent
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartWidget; 