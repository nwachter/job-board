import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { user_id: string } },
) {
  const { user_id } = await params;
  try {
    // const applicationId = parseInt(params.user_id, 10);

    if (isNaN(Number(user_id))) {
      return NextResponse.json(
        { error: "ID de l'utilisateur invalide" },
        { status: 400 },
      );
    }

    const application = await prisma.application.findMany({
      where: {
        user_id: Number(user_id),
      },
      include: {
        user: true,
        offer: true,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json({
      error: `Erreur lors de la recherche des candidatures de l'user # ${user_id}`,
      status: 500,
    });
  }
}
