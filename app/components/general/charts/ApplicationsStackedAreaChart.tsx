"use client";

import type { ChartDataPoint } from "@/app/services/applications";
import type { Application } from "@/app/types/application";
import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Web3-inspired status colors
const STATUS_COLORS: { [key: string]: string } = {
  PENDING: "#9D4EDD", // Electric purple
  APPROVED: "#7B2CBF", // Darker purple
  REJECTED: "#C77DFF", // Lighter purple
  INTERVIEW: "#5A189A", // Deep purple
  OFFER: "#3C096C", // Very deep purple
};

type ApplicationsStackedAreaChartProps = {
  processedChartData: { chartData: ChartDataPoint[]; data: Application[] };
};

export default function ApplicationsStackedAreaChart({
  processedChartData,
}: ApplicationsStackedAreaChartProps) {
  // Get all unique statuses from data for rendering areas
  const statuses = useMemo(() => {
    if (!processedChartData?.chartData?.length) return [];
    // Get all keys except 'date'
    const allKeys = Object.keys(processedChartData.chartData[0] || {}).filter(
      (key) => key !== "date",
    );
    return allKeys;
  }, [processedChartData]);

  if (!processedChartData?.chartData?.length) {
    return (
      <div className="flex h-full w-full items-center justify-center text-eggplant/50">
        No application data available
      </div>
    );
  }

  // Custom tooltip style
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-electric-purple/20 bg-white/90 p-3 shadow-lg backdrop-blur-sm">
          <p className="font-medium text-eggplant">{label}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <p className="text-sm">
                  <span className="font-medium">{entry.name}: </span>
                  <span>{entry.value}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={processedChartData?.chartData}
          margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
        >
          <defs>
            {statuses.map((status) => (
              <linearGradient
                key={`gradient-${status}`}
                id={`color-${status}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={STATUS_COLORS[status] || "#9D4EDD"}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={STATUS_COLORS[status] || "#9D4EDD"}
                  stopOpacity={0.2}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#4B5563", fontSize: 10 }}
            tickLine={{ stroke: "#9CA3AF" }}
            axisLine={{ stroke: "#D1D5DB" }}
          />
          <YAxis
            tick={{ fill: "#4B5563", fontSize: 10 }}
            tickLine={{ stroke: "#9CA3AF" }}
            axisLine={{ stroke: "#D1D5DB" }}
          />
          <Tooltip content={<CustomTooltip />} />

          {statuses.map((status) => (
            <Area
              key={status}
              type="monotone"
              dataKey={status}
              name={status}
              stackId="1"
              stroke={STATUS_COLORS[status] || "#9D4EDD"}
              fill={`url(#color-${status})`}
              strokeWidth={2}
              fillOpacity={0.8}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
