import React, { PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type StackedAreaChartProps = { data: any[] };
const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const StackedAreaChart = ({ data }: StackedAreaChartProps) => {
  <ResponsiveContainer width="100%" height="h-[200px]">
    <AreaChart
      width={500}
      height={400}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Area
        type="monotone"
        dataKey="UNDER_REVIEW"
        stackId="1"
        stroke="#60a5fa"
        fill="#60a5fa"
        fillOpacity={0.6}
        name="En cours d'examen"
      />
      <Area
        type="monotone"
        dataKey="ACCEPTED"
        stackId="1"
        stroke="#34d399"
        fill="#34d399"
        fillOpacity={0.6}
        name="Acceptée"
      />
      <Area
        type="monotone"
        dataKey="REJECTED"
        stackId="1"
        stroke="#ef4444"
        fill="#ef4444"
        fillOpacity={0.6}
        name="Rejetée"
      />
    </AreaChart>
  </ResponsiveContainer>;
};
