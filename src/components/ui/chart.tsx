import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  height?: number;
  loading?: boolean;
}

const Chart: React.FC<ChartProps> = ({
  title,
  children,
  className,
  height = 300,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card className={cn("card-hover", className)}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div
            className="animate-pulse bg-muted rounded"
            style={{ height: `${height}px` }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("card-hover", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div style={{ height: `${height}px` }}>{children}</div>
      </CardContent>
    </Card>
  );
};

export default Chart; 