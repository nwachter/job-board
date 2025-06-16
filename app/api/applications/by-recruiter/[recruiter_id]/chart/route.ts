import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";
import { Application } from "@/app/types/application";

// Define the expected status values from your schema
type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

type ChartDataPoint = {
  date: string;
  [status: string]: string | number;
};

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ recruiter_id: string }> } // Remove Promise wrapper
) {
  try {
    // Direct access to params without await
    const { recruiter_id } = await params;
    const recruiterId = parseInt(recruiter_id, 10);

    if (isNaN(recruiterId)) {
      return NextResponse.json({ error: "Invalid recruiter ID" }, { status: 400 });
    }

    // Get all applications for offers posted by this recruiter
    const applications = await prisma.application.findMany({
      where: {
        offer: {
          recruiter_id: recruiterId,
        },
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
        createdAt: "asc",
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
      );
    }

    const chartData = getRecruiterApplicationsStatisticsForChart(applications as Application[]);

    return NextResponse.json(
      {
        message: "Applications retrieved successfully",
        data: applications,
        chartData: chartData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving applications:", error);
    return NextResponse.json(
      {
        error: "Error while retrieving applications",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Uncomment this - it's important for connection management
  }
}

function getRecruiterApplicationsStatisticsForChart(applications: Application[]): ChartDataPoint[] {
  if (!applications || applications.length === 0) {
    return [];
  }

  const allStatuses = new Set<string>();
  applications.forEach(app => {
    if (app.status) {
      allStatuses.add(app.status);
    }
  });
  const statusArray = Array.from(allStatuses);

  if (statusArray.length === 0) {
    return [];
  }

  // Create a map to store applications by date
  const dataByDate = new Map<string, ChartDataPoint>();

  // Initialize counts for each date with all possible statuses
  applications.forEach(app => {
    const date = format(new Date(app.createdAt || new Date()), "yyyy-MM-dd");

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
