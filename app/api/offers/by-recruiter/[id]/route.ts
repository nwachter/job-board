import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// type Params = {
//   id: string;
// };

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (isNaN(Number(id))) {
    return NextResponse.json({
      error: "L'identifiant du recruteur est invalide",
      status: 400,
    });
  }

  try {
    const offer = await prisma.offer.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        recruiter: true,
        applications: true,
        skills: true,
      },
    });
    return NextResponse.json({
      message: `Offre du recruteur #${id} récupérée avec succès`,
      data: offer,
      status: 200,
    });
  } catch (error: unknown) {
    console.error(
      `Erreur lors de la recherche de l'offre du recruteur #${id}`,
      error,
    );
    return NextResponse.json({
      error: `Erreur lors de la recherche de l'offre du recruteur #${id}`,
      status: 500,
    });
  }
}
