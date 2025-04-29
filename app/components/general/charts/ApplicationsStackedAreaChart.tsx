"use client";
import { ChartDataPoint } from "@/app/services/applications";
import { Application } from "@/app/types/application";
import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample status colors - you can customize these
const STATUS_COLORS: { [key: string]: string } = {
  PENDING: "#8884d8",
  APPROVED: "#82ca9d",
  REJECTED: "#ff8042",
  // INTERVIEW: "#8dd1e1",
  // OFFER: "#a4de6c"
};

type ApplicationsStackedAreaChartProps = {
  processedChartData: { chartData: ChartDataPoint[]; data: Application[] };
};

export default function ApplicationsStackedAreaChart({
  processedChartData,
}: ApplicationsStackedAreaChartProps) {
  // Get all unique statuses from data for rendering areas
  const statuses = useMemo(() => {
    if (!processedChartData) return [];
    console.log("processedChartData : ", processedChartData);
    // Get all keys except 'date'
    const allKeys = Object.keys(processedChartData.chartData[0]).filter(
      (key) => key !== "date",
    );
    return allKeys;
  }, [processedChartData]);

  if (!processedChartData) {
    return <div className="p-6 text-center">No application data available</div>;
  }

  return (
    <div className="h-24 w-full md:h-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={processedChartData?.chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: -10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontWeight={600} fontSize={12} />
          <YAxis fontWeight={600} fontSize={12} />
          <Tooltip />
          {/* <Legend /> */}

          {statuses.map((status) => (
            <Area
              key={status}
              type="monotone"
              dataKey={status}
              name={status}
              stackId="1"
              stroke={
                STATUS_COLORS[status as string] ||
                `#${Math.floor(Math.random() * 16777215).toString(16)}`
              }
              fill={
                STATUS_COLORS[status as string] ||
                `#${Math.floor(Math.random() * 16777215).toString(16)}`
              }
              strokeWidth={2}
              fillOpacity={0.6}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
