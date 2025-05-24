import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { DecodedToken } from "@/app/types/misc";
import jwt from "jsonwebtoken";
import { authMiddleware } from "@/app/middleware";

const prisma = new PrismaClient();

type Params = {
  recruiter_id: string;
};

export async function GET(request: Request, { params }: { params: Params }) {
  const { recruiter_id } = await params;
  try {
    const offer = await prisma.offer.findUnique({
      where: {
        id: Number(recruiter_id),
      },
      include: {
        recruiter: true,
        applications: true,
        skills: true,
      },
    });
    return NextResponse.json({
      message: `Offre du recruteur #${recruiter_id} récupérée avec succès`,
      data: offer,
      status: 200,
    });
  } catch (error: unknown) {
    console.error(
      `Erreur lors de la recherche de l'offre du recruteur #${recruiter_id}`,
      error,
    );
    return NextResponse.json({
      error: `Erreur lors de la recherche de l'offre du recruteur #${recruiter_id}`,
      status: 500,
    });
  }
}
