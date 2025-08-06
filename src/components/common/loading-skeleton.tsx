import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, style }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
      style={style}
    />
  );
};

interface MetricCardSkeletonProps {
  className?: string;
}

export const MetricCardSkeleton: React.FC<MetricCardSkeletonProps> = ({
  className,
}) => {
  return (
    <Card className={cn("card-hover", className)}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg" />
            <div className="space-y-1 sm:space-y-2">
              <Skeleton className="h-3 w-20 sm:h-4 sm:w-24" />
              <Skeleton className="h-6 w-24 sm:h-8 sm:w-32" />
            </div>
          </div>
          <div className="text-right space-y-1 sm:space-y-2">
            <Skeleton className="h-3 w-12 sm:h-4 sm:w-16 ml-auto" />
            <Skeleton className="h-2 w-16 sm:h-3 sm:w-20 ml-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ChartSkeletonProps {
  className?: string;
  height?: number;
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({
  className,
  height = 300,
}) => {
  return (
    <Card className={cn("card-hover", className)}>
      <div className="p-4 sm:p-6">
        <Skeleton className="h-4 w-24 sm:h-6 sm:w-32 mb-3 sm:mb-4" />
        <Skeleton className="w-full" style={{ height: `${height}px` }} />
      </div>
    </Card>
  );
};

interface TableSkeletonProps {
  className?: string;
  rows?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  className,
  rows = 5,
}) => {
  return (
    <Card className={cn("card-hover", className)}>
      <div className="p-4 sm:p-6">
        <Skeleton className="h-4 w-24 sm:h-6 sm:w-32 mb-3 sm:mb-4" />
        <div className="space-y-2 sm:space-y-3">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="flex space-x-2 sm:space-x-4">
              <Skeleton className="h-3 sm:h-4 flex-1" />
              <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
              <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
              <Skeleton className="h-3 sm:h-4 w-18 sm:w-24" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default Skeleton; 