import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Activity } from "lucide-react";
import { AnalyticsData } from "@/lib/types";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";

interface OverviewStatsProps {
  data: AnalyticsData;
  className?: string;
}

const OverviewStats: React.FC<OverviewStatsProps> = ({ data, className }) => {
  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(data.metrics.revenue),
      change: data.metrics.growth,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Active Users",
      value: formatNumber(data.metrics.users),
      change: 8.2,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Conversions",
      value: formatNumber(data.metrics.conversions),
      change: 15.7,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Growth Rate",
      value: formatPercentage(data.metrics.growth),
      change: 2.1,
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ];

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6", className)}>
      {stats.map((stat, index) => (
        <Card key={index} className="card-hover transition-all duration-200 hover:shadow-md">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className={cn("p-2 rounded-lg flex-shrink-0", stat.bgColor)}>
                  <stat.icon className={cn("h-4 w-4 sm:h-5 sm:w-5", stat.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{stat.title}</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold truncate">{stat.value}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0">
                {stat.change > 0 ? (
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                )}
                <span
                  className={cn(
                    "text-xs sm:text-sm font-medium",
                    stat.change > 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {Math.abs(stat.change)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OverviewStats; 