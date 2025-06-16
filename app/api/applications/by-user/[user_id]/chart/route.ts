// TO DELETE

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";
import { Application } from "@/app/types/application";

type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

interface ChartDataPoint {
  date: string;
  [status: string]: string | number;
}

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: Promise<{ user_id: string }> }) {
  try {
    const { user_id } = await params;
    const userId = parseInt(user_id, 10);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Get all applications for offers posted by this usee
    const applications = await prisma.application.findMany({
      where: {
        user_id: userId,
      },
      include: {
        offer: {
          include: {
            location: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: "asc", // Order by ascending to process chronologically
      },
    });

    if (!applications || applications.length === 0) {
      return NextResponse.json(
        {
          message: "No applications found",
          data: [],
          chartData: [],
        },
        { status: 200 }
      ); // Return empty arrays instead of 404
    }

    // Process applications for chart data
    const chartData = getUserApplicationsStatisticsForChart(applications as Application[]);

    return NextResponse.json(
      {
        message: "Applications retrieved successfully",
        data: applications,
        chartData: chartData,
      },
      { status: 200 }
    );
  } catch (error) {
    // console.error("Error retrieving applications:", error);
    return NextResponse.json(
      { error: "Error while retreiving applications (applications/by-user/[user_id]/chart)" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Always disconnect prisma client
  }
}

function getUserApplicationsStatisticsForChart(applications: Application[]): ChartDataPoint[] {
  // Get all unique statuses from the applications
  const allStatuses = new Set<string>();
  applications.forEach(app => {
    if (app.status) {
      allStatuses.add(app.status);
    }
  });
  const statusArray = Array.from(allStatuses);

  // Create a map to store applications by date
  const dataByDate = new Map<string, ChartDataPoint>();

  // Initialize counts for each date with all possible statuses
  applications.forEach(app => {
    const date = format(new Date(app.createdAt!), "yyyy-MM-dd");

    if (!dataByDate.has(date)) {
      // Create an initial object with the date and all statuses set to 0
      const initialData: ChartDataPoint = { date };
      statusArray.forEach(status => {
        initialData[status] = 0;
      });
      dataByDate.set(date, initialData);
    }

    // Increment the count for the appropriate status
    const currentData = dataByDate.get(date)!;
    if (app.status && typeof currentData[app.status] === "number") {
      currentData[app.status] = (currentData[app.status] as number) + 1;
    }
  });

  // Convert map to array and sort by date
  const chartData = Array.from(dataByDate.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate cumulative values
  const cumulativeCounts: Record<string, number> = {};
  statusArray.forEach(status => {
    cumulativeCounts[status] = 0;
  });

  return chartData.map(dayData => {
    const result: ChartDataPoint = { date: dayData.date };

    // Add current day's values to cumulative counts for each status
    statusArray.forEach(status => {
      cumulativeCounts[status] += (dayData[status] as number) || 0;
      result[status] = cumulativeCounts[status];
    });

    return result;
  });
}
