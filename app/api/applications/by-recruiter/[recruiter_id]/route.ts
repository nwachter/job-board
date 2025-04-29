import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { recruiter_id: string } },
) {
  try {
    const { recruiter_id } = await params;
    // const applicationId = parseInt(params.recruiter_id, 10);

    if (isNaN(Number(recruiter_id))) {
      return NextResponse.json(
        { error: "ID de candidature invalide" },
        { status: 400 },
      );
    }

    const application = await prisma.application.findMany({
      where: {
        id: Number(recruiter_id),
      },
      include: {
        user: true,
        offer: true,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json({
      error: "Erreur lors de la recherche de la candidature...",
      status: 500,
    });
  }
}
