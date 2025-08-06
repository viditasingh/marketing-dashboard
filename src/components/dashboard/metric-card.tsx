import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";
import { MetricCard as MetricCardType } from "@/lib/types";
import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

interface MetricCardProps {
  metric: MetricCardType;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, className }) => {
  const IconComponent = Icons[metric.icon as keyof typeof Icons] as LucideIcon;

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case "currency":
        return formatCurrency(value);
      case "percentage":
        return formatPercentage(value);
      default:
        return formatNumber(value);
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case "positive":
        return "text-green-600 dark:text-green-400";
      case "negative":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case "positive":
        return "↗";
      case "negative":
        return "↘";
      default:
        return "→";
    }
  };

  return (
    <Card className={cn("card-hover", className)}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10">
              <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                {metric.title}
              </p>
              <p className="text-xl sm:text-2xl font-bold">
                {formatValue(metric.value, metric.format)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div
              className={cn(
                "flex items-center space-x-1 text-xs sm:text-sm font-medium",
                getChangeColor(metric.changeType)
              )}
            >
              <span>{getChangeIcon(metric.changeType)}</span>
              <span>{formatPercentage(metric.change)}</span>
            </div>
            <p className="text-xs text-muted-foreground">vs last month</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard; 