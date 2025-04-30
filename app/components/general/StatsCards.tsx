"use client";

import type React from "react";

import { useGetRecruiterApplicationsStatisticsForChart } from "@/app/hooks/useApplication";
import {
  ArrowRight,
  ChevronUp,
  TrendingUp,
  Users,
  Briefcase,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import ApplicationsStackedAreaChart from "./charts/ApplicationsStackedAreaChart";

interface Stats8Props {
  heading?: string;
  description?: string;
  link?: {
    text: string;
    url: string;
  };
  stats?: Array<{
    id: string;
    value: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  userId: number;
}

export const Stats8 = ({
  heading = "Offres",
  description = "Statistiques sur les offres et candidatures de votre compte",
  link,
  stats = [
    {
      id: "stat-1",
      value: "250%+",
      label: "average growth in user engagement",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      id: "stat-2",
      value: "$2.5m",
      label: "annual savings per enterprise partner",
      icon: <TrendingUp className="h-5 w-5" />,
    },
  ],
  userId,
}: Stats8Props) => {
  const [animatedStats, setAnimatedStats] = useState(
    stats.map((stat) => ({ id: stat.id, value: 1 })),
  );

  const {
    data: applicationStatistics,
    isLoading: isLoadingApplicationsStatistics,
  } = useGetRecruiterApplicationsStatisticsForChart(userId);

  useEffect(() => {
    stats.forEach((stat, index) => {
      const numericValue = Number.parseInt(stat.value.replace(/\D/g, "")) || 0;
      let current = 1;

      const interval = setInterval(() => {
        setAnimatedStats((prevStats) => {
          const updatedStats = [...prevStats];
          updatedStats[index] = { id: stat.id, value: current };
          return updatedStats;
        });

        if (current >= numericValue) {
          clearInterval(interval);
        } else {
          current += Math.ceil(numericValue / 50); // Adjust speed
        }
      }, 30);

      return () => clearInterval(interval);
    });
  }, [stats]);

  const quadriStat = [
    { label: "Candidates", value: 10, icon: <Users className="h-4 w-4" /> },
    {
      label: "Job openings",
      value: 5,
      icon: <Briefcase className="h-4 w-4" />,
    },
    { label: "Accepted", value: 2, icon: <CheckCircle className="h-4 w-4" /> },
    { label: "Rejected", value: 3, icon: <XCircle className="h-4 w-4" /> },
  ];

  return (
    <section className="mb-8 rounded-3xl border border-eggplant/20 bg-white/50 px-6 py-6 font-sans shadow-md shadow-eggplant/15 backdrop-blur-sm md:px-10 md:py-12">
      <div className="container mx-auto">
        <div className="mb-8 flex flex-col gap-4">
          <div className="inline-flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-electric-purple"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-electric-purple/70"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-electric-purple/40"></div>
          </div>
          <h2 className="bg-gradient-to-r from-electric-purple to-eggplant bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
            {heading}
          </h2>
          <p className="max-w-2xl text-eggplant/80">{description}</p>
          {link && (
            <a
              href={link.url}
              className="group mt-2 flex w-fit items-center gap-1 font-medium text-electric-purple/70 hover:underline"
            >
              {link.text}
              <ArrowRight className="h-auto w-4 transition-transform group-hover:translate-x-1" />
            </a>
          )}
        </div>

        <div className="grid gap-4 max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:auto-cols-auto lg:grid-flow-col">
          <div className="grid grid-cols-1 grid-rows-2 gap-2">
            {" "}
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-eggplant/20 bg-gradient-to-br from-white/80 to-white/40 p-4 shadow-lg shadow-eggplant/5 backdrop-blur-sm transition-all hover:translate-y-[-2px] hover:shadow-eggplant/10"
              >
                <div className="absolute inset-0 z-50 bg-gradient-to-br from-cream/5 to-eggplant/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-electric-purple/10">
                    {stat.icon || (
                      <TrendingUp className="h-5 w-5 text-electric-purple" />
                    )}
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full">
                    <ChevronUp className="h-4 w-4 text-electric-purple" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-electric-purple to-eggplant bg-clip-text text-3xl font-bold leading-tight text-transparent opacity-80 md:text-4xl">
                  {animatedStats[index]?.value.toLocaleString() +
                    (stat.value.includes("%") ? "%" : "")}
                </div>
                <p className="font-medium text-eggplant/70">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Chart Card */}
          <div className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-eggplant/20 bg-gradient-to-br from-white/80 to-white/40 p-4 shadow-lg shadow-eggplant/5 backdrop-blur-sm transition-all hover:translate-y-[-2px] hover:shadow-eggplant/10 md:col-span-2">
            <div className="absolute inset-0 bg-gradient-to-br from-electric-purple/5 to-eggplant/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold text-eggplant">
                Applications Over Time
              </h3>
              <div className="flex h-8 w-8 items-center justify-center rounded-full">
                <TrendingUp className="h-4 w-4 text-electric-purple" />
              </div>
            </div>
            <div className="h-48 w-full">
              {applicationStatistics && (
                <ApplicationsStackedAreaChart
                  processedChartData={applicationStatistics ?? []}
                />
              )}
              {!applicationStatistics && (
                <div className="flex h-full w-full items-center justify-center text-eggplant/50">
                  Loading chart data...
                </div>
              )}
            </div>
          </div>

          {/* Quadri-Stat Card */}
          <div className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-eggplant/20 bg-gradient-to-br from-white/80 to-white/40 p-3 shadow-lg shadow-eggplant/5 backdrop-blur-sm transition-all hover:translate-y-[-2px] hover:shadow-eggplant/10">
            <div className="absolute inset-0 bg-gradient-to-br from-electric-purple/5 to-eggplant/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold text-eggplant">Key Metrics</h3>
              <div className="flex h-8 w-8 items-center justify-center rounded-full">
                <Users className="h-4 w-4 text-electric-purple" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quadriStat.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 rounded-xl border border-eggplant/10 bg-gradient-to-br from-white/60 to-white/20 p-3 shadow-sm transition-all hover:shadow-md hover:shadow-eggplant/5"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-electric-purple/20 to-eggplant/10">
                      {stat.icon}
                    </div>
                    <span className="bg-gradient-to-r from-electric-purple to-eggplant bg-clip-text text-2xl font-bold text-transparent">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-eggplant/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
