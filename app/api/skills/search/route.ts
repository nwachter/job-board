import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type QueryParameters = {
  [key: string]: { contains?: string } | { name?: { contains?: string } };
  // | { location_id?: number } | { contract_type?: string }
};

export async function POST(request: Request) {
  try {
    const { searchQuery, contractType, locationId } = await request.json();

    const queryParameters: QueryParameters[] = [
      { name: { contains: searchQuery } },
    ];

    const skills = await prisma.skill.findMany({
      where: {
        OR: queryParameters,
      },
      include: {
        users: true,
        offers: true,
      },
    });

    return NextResponse.json(skills);
  } catch (e: unknown) {
    console.error("Error searching skills:", e);
    return NextResponse.json({
      error: "Erreur lors de la recherche des compétences !",
      status: 500,
    });
  }
}
