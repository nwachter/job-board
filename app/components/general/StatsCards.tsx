"use client";
import {
  useGetApplicationsByRecruiterId,
  useGetRecruiterApplicationsStatisticsForChart,
} from "@/app/hooks/useApplication";
import { ChartDataPoint } from "@/app/services";
import { ArrowRight } from "lucide-react";
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
    },
    {
      id: "stat-2",
      value: "$2.5m",
      label: "annual savings per enterprise partner",
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
    isError: isErrorApplicationsStatistics,
    error: errorApplicationsStatistics,
  } = useGetRecruiterApplicationsStatisticsForChart(userId);

  useEffect(() => {
    stats.forEach((stat, index) => {
      const numericValue = parseInt(stat.value.replace(/\D/g, "")) || 0;
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
    });
  }, [stats]);

  const quadriStat = {
    values: [3, 10, 2, 7, 5],
    contents: [
      "applications in the last week",
      "total offers created",
      "accepted applications",
      "refused applications",
      "feedback offered to applicants",
    ],
  };
  return (
    <section className="backf=drop-blur-md mb-6 rounded-[70px] bg-white/50 px-10 py-16 font-dm-sans shadow-xl shadow-eggplant/15">
      <div className="container">
        <div className="flex flex-col gap-4">
          <h2 className="font-merriweather-sans text-2xl font-bold md:text-4xl">
            {heading}
          </h2>
          <p>{description}</p>
          {link && (
            <a
              href={link.url}
              className="flex items-center gap-1 font-bold hover:underline"
            >
              {link.text}
              <ArrowRight className="h-auto w-4" />
            </a>
          )}
        </div>
        <div className="mt-10 grid gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="flex flex-col gap-5 rounded-[30px] border-[1px] border-eggplant/15 bg-gradient-to-br from-[#3E1A99]/30 to-electric-purple/30 p-6 text-white shadow-md shadow-eggplant/15 transition-all hover:scale-105 hover:brightness-110 hover:filter"
            >
              <div className="font-roboto text-6xl font-bold">
                {
                  //   stat.value
                }
                {animatedStats[index]?.value.toLocaleString() +
                  (stat.value.includes("%") ? "%" : "")}
              </div>
              <p className="text-eggplant">{stat.label}</p>
            </div>
          ))}
          <div className="flex flex-col gap-5 rounded-[30px] border-[1px] border-eggplant/15 bg-gradient-to-br from-[#3E1A99]/30 to-electric-purple/30 p-6 text-white shadow-md shadow-eggplant/15 transition-all hover:scale-105 hover:brightness-110 hover:filter">
            {applicationStatistics && (
              <ApplicationsStackedAreaChart
                processedChartData={applicationStatistics ?? []}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
