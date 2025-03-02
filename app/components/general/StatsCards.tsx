"use client";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

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
    }
  ],
}: Stats8Props) => {
    const [animatedStats, setAnimatedStats] = useState(
        stats.map((stat) => ({ id: stat.id, value: 1 }))
      );
    
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
  return (
    <section className="py-16 px-10 mb-6 shadow-eggplant/15 shadow-xl bg-white/50  backf=drop-blur-md rounded-[70px] font-dm-sans">
      <div className="container">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-merriweather-sans font-bold md:text-4xl">{heading}</h2>
          <p>{description}</p>
          {link && <a
            href={link.url}
            className="flex items-center gap-1 font-bold hover:underline"
          >
            {link.text}
            <ArrowRight className="h-auto w-4" />
          </a>}
        </div>
        <div className="mt-10 grid gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={stat.id} className="flex text-white rounded-[30px] hover:scale-105 transition-all hover:filter hover:brightness-110  bg-gradient-to-br from-[#3E1A99]/30 to-electric-purple/30 shadow-eggplant/15 shadow-md border-[1px] border-eggplant/15 flex-col gap-5 p-6 ">
              <div className="text-6xl font-roboto font-bold">{
            //   stat.value
                }
                        {animatedStats[index]?.value.toLocaleString() + (stat.value.includes('%') ? '%' : '')}
                
              </div>
              <p className="text-eggplant">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
