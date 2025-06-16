import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/lib/middlewares/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const auth = await authMiddleware();

    // Check if auth is an object and has an error property
    if (typeof auth === "object" && auth !== null && "error" in auth) {
      return NextResponse.json({ error: "Token invalide. Accès non autorisé", status: 401 });
    }

    const locations = await prisma.location.findMany({
      include: {
        offers: true,
      },
    });
    return NextResponse.json(locations);
  } catch (error) {
    console.log("Error fetching locations", error);
    return NextResponse.json({ error: "Erreur lors de la recherche des locations...", status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await authMiddleware();

    // Check if auth is an object and has an error property
    if (typeof auth === "object" && auth !== null && "error" in auth) {
      return NextResponse.json({ error: "Token invalide. Accès non autorisé", status: 401 });
    }

    if (!auth) {
      return NextResponse.json({ error: "Accès non autorisé", status: 401 });
    }

    const { city, country } = await request.json();

    if (!city || !country) {
      return NextResponse.json({ error: "Il manque des champs requis", status: 400 });
    }

    const newLocation = await prisma.location.create({
      data: {
        city,
        country,
      },
      include: {
        offers: true,
      },
    });

    return NextResponse.json({ message: "Location créée !", data: newLocation, status: 201 });
  } catch (e: unknown) {
    console.error("Error creating location:", e);
    return NextResponse.json({ error: "Erreur lors de la création de la location !", status: 500 });
  }
}
